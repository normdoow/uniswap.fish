import bn from "bignumber.js";
import {
  Pool,
  Position,
  Tick,
  Token,
} from "../../common/interfaces/uniswap.interface";
import { getFeeTierPercentage } from "./helper";

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const Q96 = new bn(2).pow(96);
const Q128 = new bn(2).pow(128);
const ZERO = new bn(0);

// Ref: https://ethereum.stackexchange.com/a/144704
export const calculatePositionFees = (
  pool: Pool,
  position: Position,
  token0: Token | null,
  token1: Token | null
) => {
  const tickCurrent = Number(pool.tick);
  const tickLower = Number(position.tickLower.tickIdx);
  const tickUpper = Number(position.tickUpper.tickIdx);
  const liquidity = new bn(position.liquidity);

  // Check out the relevant formulas below which are from Uniswap Whitepaper Section 6.3 and 6.4
  // 𝑓𝑟 =𝑓𝑔−𝑓𝑏(𝑖𝑙)−𝑓𝑎(𝑖𝑢)
  // 𝑓𝑢 =𝑙·(𝑓𝑟(𝑡1)−𝑓𝑟(𝑡0))
  // Global fee growth per liquidity '𝑓𝑔' for both token 0 and token 1
  let feeGrowthGlobal_0 = new bn(pool.feeGrowthGlobal0X128);
  let feeGrowthGlobal_1 = new bn(pool.feeGrowthGlobal1X128);

  // Fee growth outside '𝑓𝑜' of our lower tick for both token 0 and token 1
  let tickLowerFeeGrowthOutside_0 = new bn(
    position.tickLower.feeGrowthOutside0X128
  );
  let tickLowerFeeGrowthOutside_1 = new bn(
    position.tickLower.feeGrowthOutside1X128
  );

  // Fee growth outside '𝑓𝑜' of our upper tick for both token 0 and token 1
  let tickUpperFeeGrowthOutside_0 = new bn(
    position.tickUpper.feeGrowthOutside0X128
  );
  let tickUpperFeeGrowthOutside_1 = new bn(
    position.tickUpper.feeGrowthOutside1X128
  );

  // These are '𝑓𝑏(𝑖𝑙)' and '𝑓𝑎(𝑖𝑢)' from the formula
  // for both token 0 and token 1
  let tickLowerFeeGrowthBelow_0 = ZERO;
  let tickLowerFeeGrowthBelow_1 = ZERO;
  let tickUpperFeeGrowthAbove_0 = ZERO;
  let tickUpperFeeGrowthAbove_1 = ZERO;

  // These are the calculations for '𝑓b(𝑖)' from the formula
  // for both token 0 and token 1
  if (tickCurrent >= tickLower) {
    tickLowerFeeGrowthBelow_0 = tickLowerFeeGrowthOutside_0;
    tickLowerFeeGrowthBelow_1 = tickLowerFeeGrowthOutside_1;
  } else {
    tickLowerFeeGrowthBelow_0 = feeGrowthGlobal_0.minus(
      tickLowerFeeGrowthOutside_0
    );
    tickLowerFeeGrowthBelow_1 = feeGrowthGlobal_1.minus(
      tickLowerFeeGrowthOutside_1
    );
  }

  // These are the calculations for '𝑓𝑎(𝑖)' from the formula
  // for both token 0 and token 1
  if (tickCurrent < tickUpper) {
    tickUpperFeeGrowthAbove_0 = tickUpperFeeGrowthOutside_0;
    tickUpperFeeGrowthAbove_1 = tickUpperFeeGrowthOutside_1;
  } else {
    tickUpperFeeGrowthAbove_0 = feeGrowthGlobal_0.minus(
      tickUpperFeeGrowthOutside_0
    );
    tickUpperFeeGrowthAbove_1 = feeGrowthGlobal_1.minus(
      tickUpperFeeGrowthOutside_1
    );
  }

  // Calculations for '𝑓𝑟(𝑡1)' part of the '𝑓𝑢 =𝑙·(𝑓𝑟(𝑡1)−𝑓𝑟(𝑡0))' formula
  // for both token 0 and token 1
  let fr_t1_0 = feeGrowthGlobal_0
    .minus(tickLowerFeeGrowthBelow_0)
    .minus(tickUpperFeeGrowthAbove_0);
  let fr_t1_1 = feeGrowthGlobal_1
    .minus(tickLowerFeeGrowthBelow_1)
    .minus(tickUpperFeeGrowthAbove_1);

  // '𝑓𝑟(𝑡0)' part of the '𝑓𝑢 =𝑙·(𝑓𝑟(𝑡1)−𝑓𝑟(𝑡0))' formula
  // for both token 0 and token 1
  let feeGrowthInsideLast_0 = new bn(position.feeGrowthInside0LastX128);
  let feeGrowthInsideLast_1 = new bn(position.feeGrowthInside1LastX128);

  // The final calculations for the '𝑓𝑢 =𝑙·(𝑓𝑟(𝑡1)−𝑓𝑟(𝑡0))' uncollected fees formula
  // for both token 0 and token 1 since we now know everything that is needed to compute it
  let uncollectedFees_0 = mulDiv(
    liquidity,
    fr_t1_0.minus(feeGrowthInsideLast_0),
    Q128
  );
  let uncollectedFees_1 = mulDiv(
    liquidity,
    fr_t1_1.minus(feeGrowthInsideLast_1),
    Q128
  );

  // Decimal adjustment to get final results
  let uncollectedFeesAdjusted_0 = uncollectedFees_0.div(
    expandDecimals(1, Number(token0?.decimals || 18)).toFixed(
      Number(token0?.decimals || 18)
    )
  );
  let uncollectedFeesAdjusted_1 = uncollectedFees_1.div(
    expandDecimals(1, Number(token1?.decimals || 18)).toFixed(
      Number(token1?.decimals || 18)
    )
  );

  return [
    uncollectedFeesAdjusted_0.toNumber(),
    uncollectedFeesAdjusted_1.toNumber(),
  ];
};

export const getTickFromPrice = (
  price: number,
  token0Decimal: string,
  token1Decimal: string
): number => {
  const token0 = expandDecimals(price, Number(token0Decimal));
  const token1 = expandDecimals(1, Number(token1Decimal));
  const sqrtPrice = encodeSqrtPriceX96(token1).div(encodeSqrtPriceX96(token0));

  return Math.log(sqrtPrice.toNumber()) / Math.log(Math.sqrt(1.0001));
};

export const getPriceFromTick = (
  tick: number,
  token0Decimal: string,
  token1Decimal: string
): number => {
  const sqrtPrice = new bn(Math.pow(Math.sqrt(1.0001), tick)).multipliedBy(
    new bn(2).pow(96)
  );
  const token0 = expandDecimals(1, Number(token0Decimal));
  const token1 = expandDecimals(1, Number(token1Decimal));
  const L2 = mulDiv(
    encodeSqrtPriceX96(token0),
    encodeSqrtPriceX96(token1),
    Q96
  );
  const price = mulDiv(L2, Q96, sqrtPrice)
    .div(new bn(2).pow(96))
    .div(new bn(10).pow(token0Decimal))
    .pow(2);

  return price.toNumber();
};

// Calculate the position tokens deposit ratio.
export const getPositionTokensDepositRatio = (
  P: number,
  Pl: number,
  Pu: number
): number => {
  const deltaL = 1000; // can be any number

  let deltaY = deltaL * (Math.sqrt(P) - Math.sqrt(Pl));
  if (P < Pl) deltaY = 0;
  if (P >= Pu) deltaY = deltaL * (Math.sqrt(Pu) - Math.sqrt(Pl));

  let deltaX = deltaL * (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu));
  if (P < Pl) deltaX = deltaL * (1 / Math.sqrt(Pl) - 1 / Math.sqrt(Pu));
  if (P >= Pu) deltaX = 0;

  return deltaY / deltaX;
};

// for calculation detail, please visit README.md (Section: Calculation Breakdown, No. 1)
interface TokensAmount {
  amount0: number;
  amount1: number;
  liquidityDelta: number;
}
export const getTokensAmountFromDepositAmountUSD = (
  P: number,
  Pl: number,
  Pu: number,
  priceUSDX: number,
  priceUSDY: number,
  depositAmountUSD: number
): TokensAmount => {
  const deltaL =
    depositAmountUSD /
    ((Math.sqrt(P) - Math.sqrt(Pl)) * priceUSDY +
      (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu)) * priceUSDX);

  let deltaY = deltaL * (Math.sqrt(P) - Math.sqrt(Pl));
  if (deltaY * priceUSDY < 0) deltaY = 0;
  if (deltaY * priceUSDY > depositAmountUSD)
    deltaY = depositAmountUSD / priceUSDY;

  let deltaX = deltaL * (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu));
  if (deltaX * priceUSDX < 0) deltaX = 0;
  if (deltaX * priceUSDX > depositAmountUSD)
    deltaX = depositAmountUSD / priceUSDX;

  return { amount0: deltaX, amount1: deltaY, liquidityDelta: deltaL };
};

// for calculation detail, please visit README.md (Section: Calculation Breakdown, No. 2)
const getLiquidityForAmount0 = (
  sqrtRatioAX96: bn,
  sqrtRatioBX96: bn,
  amount0: bn
): bn => {
  // amount0 * (sqrt(upper) * sqrt(lower)) / (sqrt(upper) - sqrt(lower))
  const intermediate = mulDiv(sqrtRatioBX96, sqrtRatioAX96, Q96);
  return mulDiv(amount0, intermediate, sqrtRatioBX96.minus(sqrtRatioAX96));
};

const getLiquidityForAmount1 = (
  sqrtRatioAX96: bn,
  sqrtRatioBX96: bn,
  amount1: bn
): bn => {
  // amount1 / (sqrt(upper) - sqrt(lower))
  return mulDiv(amount1, Q96, sqrtRatioBX96.minus(sqrtRatioAX96));
};

const getSqrtPriceX96 = (
  price: number,
  token0Decimal: number,
  token1Decimal: number
): bn => {
  const token0 = expandDecimals(price, token0Decimal);
  const token1 = expandDecimals(1, token1Decimal);

  return token0.div(token1).sqrt().multipliedBy(Q96);
};

export const getLiquidityDelta = (
  P: number,
  lowerP: number,
  upperP: number,
  amount0: number,
  amount1: number,
  token0Decimal: number,
  token1Decimal: number
): bn => {
  const amt0 = expandDecimals(amount0, token1Decimal);
  const amt1 = expandDecimals(amount1, token0Decimal);

  const sqrtRatioX96 = getSqrtPriceX96(P, token0Decimal, token1Decimal);
  const sqrtRatioAX96 = getSqrtPriceX96(lowerP, token0Decimal, token1Decimal);
  const sqrtRatioBX96 = getSqrtPriceX96(upperP, token0Decimal, token1Decimal);

  let liquidity: bn;
  if (sqrtRatioX96.lte(sqrtRatioAX96)) {
    liquidity = getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amt0);
  } else if (sqrtRatioX96.lt(sqrtRatioBX96)) {
    const liquidity0 = getLiquidityForAmount0(
      sqrtRatioX96,
      sqrtRatioBX96,
      amt0
    );
    const liquidity1 = getLiquidityForAmount1(
      sqrtRatioAX96,
      sqrtRatioX96,
      amt1
    );

    liquidity = bn.min(liquidity0, liquidity1);
  } else {
    liquidity = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amt1);
  }

  return liquidity;
};

export const estimateFee = (
  liquidityDelta: bn,
  liquidity: bn,
  volume24H: number,
  feeTier: string
): number => {
  const feeTierPercentage = getFeeTierPercentage(feeTier);
  const liquidityPercentage = liquidityDelta
    .div(liquidity.plus(liquidityDelta))
    .toNumber();

  return feeTierPercentage * volume24H * liquidityPercentage;
};

export const getLiquidityFromTick = (poolTicks: Tick[], tick: number): bn => {
  // calculate a cumulative of liquidityNet from all ticks that poolTicks[i] <= tick
  let liquidity: bn = new bn(0);
  for (let i = 0; i < poolTicks.length - 1; ++i) {
    liquidity = liquidity.plus(new bn(poolTicks[i].liquidityNet));

    const lowerTick = Number(poolTicks[i].tickIdx);
    const upperTick = Number(poolTicks[i + 1]?.tickIdx);

    if (lowerTick <= tick && tick <= upperTick) {
      break;
    }
  }

  return liquidity;
};

// private helper functions
const encodeSqrtPriceX96 = (price: number | string | bn): bn => {
  return new bn(price).sqrt().multipliedBy(Q96).integerValue(3);
};

const expandDecimals = (n: number | string | bn, exp: number): bn => {
  return new bn(n).multipliedBy(new bn(10).pow(exp));
};

const mulDiv = (a: bn, b: bn, multiplier: bn) => {
  return a.multipliedBy(b).div(multiplier);
};

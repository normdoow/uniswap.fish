import bn from "bignumber.js";
import { Tick } from "../../common/interfaces/uniswap.interface";
import { getFeeTierPercentage } from "./helper";

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const Q96 = new bn(2).pow(96);

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

// for calculation detail, please visit README.md (Section: Calculation Breakdown, No. 1)
interface TokensAmount {
  amount0: number;
  amount1: number;
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

  return { amount0: deltaX, amount1: deltaY };
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

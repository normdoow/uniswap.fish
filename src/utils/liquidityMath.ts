import bn from "bignumber.js";
import { getFeeTierPercentage } from "./helper";
import { encodePriceSqrt, expandDecimals } from "./math";

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const Q96 = new bn(2).pow(96);
const mulDiv = (a: bn, b: bn, multiplier: bn) => {
  return a.multipliedBy(b).div(multiplier);
};

// for calculation detail, please visit README.md (Section: Calculation Breakdown, No. 1)
export const getTokenAmountsFromDepositAmounts = (
  P: number,
  Pl: number,
  Pu: number,
  priceUSDX: number,
  priceUSDY: number,
  targetAmounts: number
) => {
  const deltaL =
    targetAmounts /
    ((Math.sqrt(P) - Math.sqrt(Pl)) * priceUSDY +
      (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu)) * priceUSDX);

  let deltaY = deltaL * (Math.sqrt(P) - Math.sqrt(Pl));
  if (deltaY * priceUSDY < 0) deltaY = 0;
  if (deltaY * priceUSDY > targetAmounts) deltaY = targetAmounts / priceUSDY;

  let deltaX = deltaL * (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu));
  if (deltaX * priceUSDX < 0) deltaX = 0;
  if (deltaX * priceUSDX > targetAmounts) deltaX = targetAmounts / priceUSDX;

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

export const getLiquidityForAmounts = (
  currentPrice: number,
  lowerPrice: number,
  upperPrice: number,
  _amount0: number,
  amount0Decimal: number,
  _amount1: number,
  amount1Decimal: number
): bn => {
  const sqrtRatioX96 = encodePriceSqrt(currentPrice);
  const sqrtRatioAX96 = encodePriceSqrt(lowerPrice);
  const sqrtRatioBX96 = encodePriceSqrt(upperPrice);
  const amount0 = expandDecimals(_amount0, amount0Decimal);
  const amount1 = expandDecimals(_amount1, amount1Decimal);

  let liquidity: bn;
  if (sqrtRatioX96.lte(sqrtRatioAX96)) {
    liquidity = getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
  } else if (sqrtRatioX96.lt(sqrtRatioBX96)) {
    const liquidity0 = getLiquidityForAmount0(
      sqrtRatioX96,
      sqrtRatioBX96,
      amount0
    );
    const liquidity1 = getLiquidityForAmount1(
      sqrtRatioAX96,
      sqrtRatioX96,
      amount1
    );

    liquidity = bn.min(liquidity0, liquidity1);
  } else {
    liquidity = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
  }

  return liquidity;
};

export const calculateFee = (
  liquidityDelta: bn,
  liquidity: bn,
  volume24H: number,
  _feeTier: string
): number => {
  const feeTier = getFeeTierPercentage(_feeTier);
  const liquidityPercentage = liquidityDelta
    .div(liquidity.plus(liquidityDelta))
    .toNumber();

  return feeTier * volume24H * liquidityPercentage;
};

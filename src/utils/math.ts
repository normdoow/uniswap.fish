import bn from "bignumber.js";

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

export const x96ToDecimal = (value: number | string | bn): bn => {
  return new bn(value).div(new bn(2).pow(96));
};

export const encodePriceSqrt = (reserve1: bn, reserve0: bn): bn => {
  return new bn(reserve1.toString())
    .div(reserve0.toString())
    .sqrt()
    .multipliedBy(new bn(2).pow(96))
    .integerValue(3);
};

export function expandDecimals(n: number | string | bn, exp: number): bn {
  return new bn(n).multipliedBy(new bn(10).pow(exp));
}

export const getTickFromPrice = (price: number): bn => {
  return new bn(Math.log(price).toString())
    .div(new bn(Math.log(1.0001).toString()))
    .integerValue(0);
};

export const getPriceFromTick = (tick: number): number => {
  return Math.pow(1.0001, tick);
};

export const calculateAvg = (data: number[]): number => {
  return data.reduce((result, val) => result + val, 0) / data.length;
};

export const findMax = (data: number[]): number => {
  return data.reduce((max, val) => (max > val ? max : val), 0);
};

export const findMin = (data: number[]): number => {
  return data.reduce(
    (min, val) => (min > val ? val : min),
    Number.MAX_SAFE_INTEGER
  );
};

export const divideArray = (data0: number[], data1: number[]): number[] => {
  const result: number[] = [];
  data0.forEach((d, i) => {
    result[i] = d / data1[i];
    if (isNaN(result[i])) result[i] = result[i - 1];
  });
  return result;
};

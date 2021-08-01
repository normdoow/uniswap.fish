import bn from "bignumber.js";
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

export const encodePriceSqrt = (price: number | string | bn): bn => {
  return new bn(price).sqrt().multipliedBy(new bn(2).pow(96)).integerValue(3);
};

export function expandDecimals(n: number | string | bn, exp: number): bn {
  return new bn(n).multipliedBy(new bn(10).pow(exp));
}

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

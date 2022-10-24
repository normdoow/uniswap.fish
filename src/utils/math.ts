export const findMin = (data: number[]): number => {
  return data.reduce(
    (min, val) => (min > val ? val : min),
    Number.MAX_SAFE_INTEGER
  );
};

export const findMax = (data: number[]): number => {
  return data.reduce((max, val) => (max > val ? max : val), 0);
};

export const averageArray = (data: number[]): number => {
  return data.reduce((result, val) => result + val, 0) / data.length;
};

export const divideArray = (data0: number[], data1: number[]): number[] => {
  const result: number[] = [];
  data0.forEach((d, i) => {
    result[i] = d / data1[i];
    if (isNaN(result[i])) result[i] = result[i - 1];
  });
  return result;
};

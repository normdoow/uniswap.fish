export const findMax = (data: number[]): number => {
  return data.reduce((max, val) => (max > val ? max : val), 0);
};

export const findMin = (data: number[]): number => {
  return data.reduce(
    (min, val) => (min > val ? val : min),
    Number.MAX_SAFE_INTEGER
  );
};

import { PriceChart } from "../common/interfaces/coingecko.interface";
import { Point } from "../containers/D3CorrelationChart";

export const round = (num: number, decimalPlaces = 0): number => {
  const p = Math.pow(10, decimalPlaces);
  const n = num * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
};

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

export const processPriceChartData = (
  token0PriceChart: PriceChart | null,
  token1PriceChart: PriceChart | null
): Point[] => {
  if (token0PriceChart === null || token1PriceChart === null) {
    return [];
  }

  const points: Point[] = [];
  const length = Math.min(
    token0PriceChart.prices.length,
    token1PriceChart.prices.length
  );
  for (let i = 0; i < length; ++i) {
    points.push({
      x: token0PriceChart.prices[i].timestamp,
      y: token1PriceChart.prices[i].value / token0PriceChart.prices[i].value,
    });
  }

  return points;
};

export const groupPricePointsMinMaxByDay = (
  points: Point[]
): { timestamp: number; min: number; max: number }[] => {
  const result: { timestamp: number; min: number; max: number }[] = [];
  let day = 0;
  let min = 0;
  let max = 0;
  points.forEach((p, i) => {
    const date = new Date(p.x);
    const currentDay = date.getUTCDate();
    if (currentDay !== day) {
      if (i !== 0) {
        result.push({ timestamp: day, min, max });
      }
      day = currentDay;
      min = p.y;
      max = p.y;
    } else {
      min = Math.min(min, p.y);
      max = Math.max(max, p.y);
    }
  });
  return result;
};

export const groupPricePointsMinMaxByWeek = (
  points: Point[]
): { timestamp: number; min: number; max: number }[] => {
  const getWeekFromDate = (date: Date): number => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(
      ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
    );
  };

  const result: { timestamp: number; min: number; max: number }[] = [];
  let week = 0;
  let min = 0;
  let max = 0;
  points.forEach((p, i) => {
    const date = new Date(p.x);
    const currentWeek = getWeekFromDate(date);
    if (currentWeek !== week) {
      if (i !== 0) {
        result.push({ timestamp: week, min, max });
      }
      week = currentWeek;
      min = p.y;
      max = p.y;
    } else {
      min = Math.min(min, p.y);
      max = Math.max(max, p.y);
    }
  });
  return result;
};

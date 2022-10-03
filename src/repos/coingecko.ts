import axios from "axios";
import tokenAddressMapping from "./tokenAddressMapping.json";
import { currentNetwork } from "./uniswap";

export enum QueryPeriodEnum {
  ONE_DAY = "1",
  ONE_WEEK = "7",
  ONE_MONTH = "30",
  THREE_MONTH = "90",
  ONE_YEAR = "90",
  MAX = "max",
}

export interface Token {
  id: string;
  name: string;
}
const getToken = (contractAddress: string): Token | null => {
  const mapper = tokenAddressMapping as { [key: string]: any };
  const currentPlatform = currentNetwork.id;
  const result = mapper[currentPlatform][contractAddress];
  if (result) {
    return result as Token;
  }
  const keys = Object.keys(mapper);
  for (let i = 0; i < keys.length; ++i) {
    const r = mapper[keys[i]][contractAddress];
    if (r) return r;
  }
  return null;
};

export interface Price {
  timestamp: number;
  value: number;
}
export interface PriceChart {
  tokenId: string;
  tokenName: string;
  currentPriceUSD: number;
  prices: Price[];
}
export const getPriceChart = async (
  contractAddress: string,
  queryPeriod: QueryPeriodEnum = QueryPeriodEnum.ONE_MONTH
): Promise<PriceChart | null> => {
  const token = getToken(contractAddress);

  if (!token) return null;

  const marketChartRes = (await axios.get(
    `https://api.coingecko.com/api/v3/coins/${token.id}/market_chart?vs_currency=usd&days=${queryPeriod}`
  )) as any;
  const currentPriceRes = (await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${token.id}&vs_currencies=usd`
  )) as any;
  const prices = marketChartRes.data.prices.map(
    (d: any) =>
      ({
        timestamp: d[0],
        value: d[1],
      } as Price)
  );

  return {
    tokenId: token.id,
    tokenName: token.name,
    currentPriceUSD: currentPriceRes.data[token.id].usd as number,
    prices,
  };
};

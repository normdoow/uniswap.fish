import axios from "axios";
import tokenAddressMapping from "./tokenAddressMapping.json";

export enum QueryPeriodEnum {
  ONE_DAY = "1",
  ONE_WEEK = "7",
  ONE_MONTH = "30",
  THREE_MONTH = "90",
  ONE_YEAR = "90",
  MAX = "max",
}

interface Token {
  id: string;
  name: string;
}
const getToken = (contractAddress: string): Token => {
  const mapping = tokenAddressMapping as { [key: string]: any };
  return mapping[contractAddress];
};

interface Price {
  timestamp: number;
  value: number;
}
interface PriceChart {
  tokenId: string;
  tokenName: string;
  currentPriceUSD: number;
  prices: Price[];
}
export const getPriceChart = async (
  contractAddress: string,
  queryPeriod: QueryPeriodEnum
): Promise<PriceChart> => {
  const token = getToken(contractAddress);
  const marketChart = (await axios.get(
    `https://api.coingecko.com/api/v3/coins/${token.id}/market_chart?vs_currency=usd&days=${queryPeriod}`
  )) as any;
  const currentPrice = (await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${token.id}&vs_currencies=usd`
  )) as any;
  const prices = marketChart.prices.map(
    (d: any) =>
      ({
        timestamp: d[0],
        value: d[1],
      } as Price)
  );

  return {
    tokenId: token.id,
    tokenName: token.name,
    currentPriceUSD: currentPrice[token.id].usd as number,
    prices,
  };
};

import axios from "axios";
import { Network, NETWORKS } from "../common/types";
import { getTokenLogoURL, sortToken } from "../utils/helper";
import lscache from "../utils/lscache";

export let currentNetwork = NETWORKS[0];

export const updateNetwork = (network: Network) => {
  currentNetwork = network;
};

const queryUniswap = async (query: string): Promise<any> => {
  const { data } = await axios({
    url: currentNetwork.subgraphEndpoint,
    method: "post",
    data: {
      query,
    },
  });

  return data.data;
};

export const getVolumn24H = async (poolAddress: string): Promise<number> => {
  const { poolDayDatas } = await queryUniswap(`{
    poolDayDatas(skip: 1, first: 7, orderBy: date, orderDirection: desc, where:{pool: "${poolAddress}"}) {
      volumeUSD
    }
  }`);

  const data = poolDayDatas.map((d: { volumeUSD: string }) =>
    Number(d.volumeUSD)
  );

  return (
    data.reduce((result: number, curr: number) => result + curr, 0) /
    data.length
  );
};

export interface Tick {
  tickIdx: string;
  liquidityNet: string;
  price0: string;
  price1: string;
}
const _getPoolTicks = async (
  poolAddress: string,
  result: Tick[],
  page: number = 0
): Promise<Tick[]> => {
  const res = await queryUniswap(`{
    ticks(first: 1000, skip: ${
      page * 1000
    }, where: { poolAddress: "${poolAddress}" }, orderBy: tickIdx) {
      tickIdx
      liquidityNet
      price0
      price1
    }
  }`);

  if (res === undefined || res.ticks.length === 0) {
    return result;
  }

  result = [...result, ...res.ticks];
  return await _getPoolTicks(poolAddress, result, page + 1);
};
export const getPoolTicks = async (poolAddress: string): Promise<Tick[]> => {
  const ticks = await _getPoolTicks(poolAddress, []);
  return ticks;
};

export interface V3Token {
  id: string;
  name: string;
  symbol: string;
  volumeUSD: string;
  logoURI: string;
  decimals: string;
}
export const getTopTokenList = async (): Promise<V3Token[]> => {
  const cacheKey = `${currentNetwork.id}_getTopTokenList`;
  const cacheData = lscache.get(cacheKey);
  if (cacheData) return cacheData;

  const res = await queryUniswap(`{
    tokens(skip: 0, first: 500, orderBy: volumeUSD, orderDirection: desc) {
      id
      name
      symbol
      volumeUSD
      decimals
    }
  }`);

  if (res === undefined || res.tokens.length === 0) {
    return [];
  }

  const tokens = res.tokens as V3Token[];
  const result = tokens
    .map((token) => {
      token.logoURI = getTokenLogoURL(token.id);
      return token;
    })
    .map((token) => {
      if (token.name === "Wrapped Ether" || token.name === "Wrapped Ethereum") {
        token.name = "Ethereum";
        token.symbol = "ETH";
        token.logoURI =
          "https://cdn.iconscout.com/icon/free/png-128/ethereum-2752194-2285011.png";
      }
      if (token.name === "Wrapped Matic") {
        token.name = "Polygon Native Token";
        token.symbol = "MATIC";
      }
      return token;
    })
    .filter((token) => token.symbol.length < 30);

  lscache.set(cacheKey, result, 10);
  return result;
};

export interface Pool {
  id: string;
  feeTier: string;
  liquidity: string;
  tick: string;
  sqrtPrice: string;
  token0Price: string;
  token1Price: string;
}
export const getPoolFromPair = async (
  token0: V3Token,
  token1: V3Token
): Promise<Pool[]> => {
  const sortedTokens = sortToken(token0, token1);

  const { pools } = await queryUniswap(`{
    pools(orderBy: feeTier, where: {
        token0: "${sortedTokens[0].id}",
        token1: "${sortedTokens[1].id}"}) {
      id
      tick
      sqrtPrice
      feeTier
      liquidity
      token0Price
      token1Price
    }
  }`);

  return pools as Pool[];
};

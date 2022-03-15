import axios from "axios";
import { NETWORKS } from "../common/types";
import { getTokenLogoURL, sortToken } from "../utils/helper";

let subgraphEndpoint = NETWORKS[0].subgraphEndpoint;

export const updateSubgraphEndpoint = (newEndpoint: string) => {
  subgraphEndpoint = newEndpoint;
};

const queryUniswap = async (query: string): Promise<any> => {
  const { data } = await axios({
    url: subgraphEndpoint,
    method: "post",
    data: {
      query,
    },
  });

  return data.data;
};

export const getVolumn24H = async (poolAddress: string): Promise<number> => {
  const { poolDayDatas } = await queryUniswap(`{
    poolDayDatas(skip: 1, first:3, orderBy: date, orderDirection: desc, where:{pool: "${poolAddress}"}) {
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
export const getPoolTicks = async (poolAddress: string): Promise<Tick[]> => {
  const { ticks } = await queryUniswap(`{
    ticks(first: 1000, skip: 0, where: { poolAddress: "${poolAddress}" }, orderBy: tickIdx) {
      tickIdx
      liquidityNet
      price0
      price1
    }
  }`);

  return ticks as Tick[];
};

export interface V3Token {
  id: string;
  name: string;
  symbol: string;
  volumeUSD: string;
  logoURI: string;
  decimals: string;
}
const _getTokenList = async (
  result: V3Token[],
  page: number = 0
): Promise<V3Token[]> => {
  const res = await queryUniswap(`{
    tokens(skip: ${page * 1000}, first: 1000, orderBy: id) {
      id
      name
      symbol
      volumeUSD
      decimals
    }
  }`);

  if (res === undefined || res.tokens.length === 0) {
    return result;
  }

  result = [...result, ...res.tokens];
  return await _getTokenList(result, page + 1);
};
export const getTokenList = async (): Promise<V3Token[]> => {
  const tokens = await _getTokenList([]);
  return tokens
    .map((token) => {
      token.logoURI = getTokenLogoURL(token.id);
      return token;
    })
    .map((token) => {
      if (token.name === "Wrapped Ether") {
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
    .filter((token) => token.symbol.length < 30)
    .sort((a, b) => Number(b.volumeUSD) - Number(a.volumeUSD));
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

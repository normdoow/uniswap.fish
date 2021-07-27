import axios from "axios";
import { sortToken } from "../utils/helper";

const MAINNET = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

const queryUniswap = async (query: string): Promise<any> => {
  const { data } = await axios({
    url: MAINNET,
    method: "post",
    data: {
      query,
    },
  });

  return data.data;
};

export interface Tick {
  liquidityNet: number;
  price0: number;
  price1: number;
  tickIdx: number;
}
export const getPoolTicks = async (
  poolAddress: string,
  skip: number = 0
): Promise<Tick[]> => {
  const { ticks } = await queryUniswap(`{
    ticks(skip: ${skip}, where: { poolAddress: "${poolAddress}" }, orderBy: tickIdx) {
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
}
export const getTokenList = async (): Promise<V3Token[]> => {
  const { tokens } = await queryUniswap(`{
    tokens(orderBy: id) {
      id
      name
      symbol
    }
  }`);

  return tokens as V3Token[];
};

export interface Pool {
  id: string;
  feeTier: string;
  liquidity: string;
}
export const getPoolFromPair = async (
  token0: string,
  token1: string
): Promise<Pool[]> => {
  const sortedTokens = sortToken(token0, token1);

  const { pools } = await queryUniswap(`{
    pools(orderBy: id, where: {
        token0: "${sortedTokens[0]}",
        token1: "${sortedTokens[1]}"}) {
      id
      feeTier
      liquidity
    }
  }`);

  return pools as Pool[];
};

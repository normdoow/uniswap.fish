import axios from "axios";
import { getTokenLogoURL, sortToken } from "../utils/helper";

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
  logoURI: string;
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
          "https://ethereum.org/static/4b5288012dc4b32ae7ff21fccac98de1/31987/eth-diamond-black-gray.png";
      }
      return token;
    })
    .filter((token) => token.symbol.length < 30);
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

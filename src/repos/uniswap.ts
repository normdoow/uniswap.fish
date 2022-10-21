import axios from "axios";
import { NETWORKS } from "../common/network";
import { getTokenLogoURL, sortTokens } from "../utils/uniswapv3/helper";
import lscache from "../utils/lscache";
import {
  Network,
  Pool,
  Tick,
  Token,
} from "../common/interfaces/uniswap.interface";

// TODO: Refactor this
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

const _getPoolTicksByPage = async (
  poolAddress: string,
  page: number
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

  return res.ticks;
};
export const getPoolTicks = async (poolAddress: string): Promise<Tick[]> => {
  const PAGE_SIZE = 3;
  let result: Tick[] = [];
  let page = 0;
  while (true) {
    const [pool1, pool2, pool3] = await Promise.all([
      _getPoolTicksByPage(poolAddress, page),
      _getPoolTicksByPage(poolAddress, page + 1),
      _getPoolTicksByPage(poolAddress, page + 2),
    ]);

    result = [...result, ...pool1, ...pool2, ...pool3];
    if (pool1.length === 0 || pool2.length === 0 || pool3.length === 0) {
      break;
    }
    page += PAGE_SIZE;
  }
  return result;
};

export const getTopTokenList = async (): Promise<Token[]> => {
  const cacheKey = `${currentNetwork.id}_getTopTokenList`;
  const cacheData = lscache.get(cacheKey);
  const searchTokenPageItems = localStorage.getItem(
    `SearchTokenPage_${currentNetwork.id}_tokens`
  );
  if (cacheData) {
    if (searchTokenPageItems !== null) {
      return [...cacheData, ...JSON.parse(searchTokenPageItems)];
    }
    return cacheData;
  }

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

  const tokens = res.tokens as Token[];
  let result = tokens
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
  if (searchTokenPageItems !== null) {
    result = [...result, ...JSON.parse(searchTokenPageItems)];
  }

  return result;
};

export const getToken = async (id: string): Promise<Token> => {
  const res = await queryUniswap(`{
    token(id: "${id.toLowerCase()}") {
      id
      name
      symbol
      volumeUSD
      decimals
    }
  }`);

  if (res.token !== null) {
    res.token.logoURI = getTokenLogoURL(res.token.id);
  }

  return res.token;
};

export const getPoolFromPair = async (
  token0: Token,
  token1: Token
): Promise<Pool[]> => {
  const sortedTokens = sortTokens(token0, token1);

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

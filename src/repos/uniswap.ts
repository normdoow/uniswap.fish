import axios from "axios";
import { getCurrentNetwork } from "../common/network";
import { getTokenLogoURL, sortTokens } from "../utils/uniswapv3/helper";
import lscache from "../utils/lscache";
import {
  Pool,
  Position,
  Tick,
  Token,
} from "../common/interfaces/uniswap.interface";
import { averageArray } from "../utils/math";

export const getAvgTradingVolume = async (
  poolAddress: string,
  numberOfDays: number = 7
): Promise<number> => {
  const { poolDayDatas } = await _queryUniswap(`{
    poolDayDatas(skip: 1, first: ${numberOfDays}, orderBy: date, orderDirection: desc, where:{pool: "${poolAddress}"}) {
      volumeUSD
    }
  }`);

  const volumes = poolDayDatas.map((d: { volumeUSD: string }) =>
    Number(d.volumeUSD)
  );

  return averageArray(volumes);
};

const _getPoolTicksByPage = async (
  poolAddress: string,
  page: number
): Promise<Tick[]> => {
  const res = await _queryUniswap(`{
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

const _processTokenInfo = (token: Token) => {
  token.logoURI = getTokenLogoURL(getCurrentNetwork().id, token.id);

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
};
export const getTopTokenList = async (): Promise<Token[]> => {
  const cacheKey = `${getCurrentNetwork().id}_getTopTokenList`;
  const cacheData = lscache.get(cacheKey);
  const searchTokenPageItems = localStorage.getItem(
    `SearchTokenPage_${getCurrentNetwork().id}_tokens`
  );
  if (cacheData) {
    if (searchTokenPageItems !== null) {
      return [...cacheData, ...JSON.parse(searchTokenPageItems)];
    }
    return cacheData;
  }

  const res = await _queryUniswap(`{
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
    .map(_processTokenInfo)
    .filter((token) => token.symbol.length < 30);

  lscache.set(cacheKey, result, 10); // 10 mins
  if (searchTokenPageItems !== null) {
    result = [...result, ...JSON.parse(searchTokenPageItems)];
  }

  return result;
};

export const getToken = async (tokenAddress: string): Promise<Token> => {
  const res = await _queryUniswap(`{
    token(id: "${tokenAddress.toLowerCase()}") {
      id
      name
      symbol
      volumeUSD
      decimals
    }
  }`);

  if (res.token !== null) {
    res.token = _processTokenInfo(res.token);
  }

  return res.token;
};

export const getPoolFromPair = async (
  token0: Token,
  token1: Token
): Promise<Pool[]> => {
  const sortedTokens = sortTokens(token0, token1);

  const { pools } = await _queryUniswap(`{
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
      feeGrowthGlobal0X128
      feeGrowthGlobal1X128
    }
  }`);

  return pools as Pool[];
};

export const getCurrentTick = async (poolId: string): Promise<string> => {
  const { pool } = await _queryUniswap(`{
    pool(id: "${poolId}") {
      tick
    }
  }`);
  return pool.tick;
};

// private helper functions
const _queryUniswap = async (query: string): Promise<any> => {
  const { data } = await axios({
    url: getCurrentNetwork().subgraphEndpoint,
    method: "post",
    data: {
      query,
    },
  });

  const errors = data.errors;
  if (errors && errors.length > 0) {
    console.error("Uniswap Subgraph Errors", { errors, query });
    throw new Error(`Uniswap Subgraph Errors: ${JSON.stringify(errors)}`);
  }

  return data.data;
};

const _getPoolPositionsByPage = async (
  poolAddress: string,
  page: number
): Promise<Position[]> => {
  try {
    const res = await _queryUniswap(`{
    positions(where: {
      pool: "${poolAddress}",
      liquidity_gt: 0,
    }, first: 1000, skip: ${page * 1000}) {
      id
      tickLower {
        tickIdx
        feeGrowthOutside0X128
        feeGrowthOutside1X128
      }
      tickUpper {
        tickIdx
        feeGrowthOutside0X128
        feeGrowthOutside1X128
      }
      depositedToken0
      depositedToken1
      liquidity
      collectedFeesToken0
      collectedFeesToken1
      feeGrowthInside0LastX128
      feeGrowthInside1LastX128
      transaction {
        timestamp
      }
    }
  }`);

    return res.positions;
  } catch (e) {
    return [];
  }
};

export const getPoolPositions = async (
  poolAddress: string
): Promise<Position[]> => {
  const PAGE_SIZE = 3;
  let result: Position[] = [];
  let page = 0;
  while (true) {
    const [p1, p2, p3] = await Promise.all([
      _getPoolPositionsByPage(poolAddress, page),
      _getPoolPositionsByPage(poolAddress, page + 1),
      _getPoolPositionsByPage(poolAddress, page + 2),
    ]);

    result = [...result, ...p1, ...p2, ...p3];
    if (p1.length === 0 || p2.length === 0 || p3.length === 0) {
      break;
    }
    page += PAGE_SIZE;
  }
  return result;
};

export const getPools = async (): Promise<Pool[]> => {
  try {
    const res = await _queryUniswap(`{
      pools (first: 300, orderBy: totalValueLockedUSD, orderDirection: desc, where: {liquidity_gt: 0, totalValueLockedUSD_gte: 1000000, volumeUSD_gte: 500000}) {
        id
        token0 {
          id
          symbol
          name
          decimals
          volumeUSD
        }
        token1 {
          id
          symbol
          name
          decimals
          volumeUSD
        }
        feeTier
        feesUSD
        totalValueLockedUSD
        poolDayData(first: 7, skip: 1) {
          volumeUSD
        }
      }
    }`);

    if (res === undefined || res.pools.length === 0) {
      return [];
    }

    const pools = res.pools.map((p: Pool) => {
      p.token0 = _processTokenInfo(p.token0);
      p.token1 = _processTokenInfo(p.token1);
      return p;
    });

    return pools;
  } catch (e) {
    return [];
  }
};

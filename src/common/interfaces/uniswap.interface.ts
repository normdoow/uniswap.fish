export interface Network {
  id: string;
  chainId: number;
  name: string;
  desc: string;
  logoURI: string;
  disabled?: boolean;
  isNew?: boolean;
  error?: string;
  subgraphEndpoint: string;

  // for pool overview
  totalValueLockedUSD_gte: number;
  volumeUSD_gte: number;
  disabledTopPositions?: boolean;
}

export interface Tick {
  tickIdx: string;
  liquidityNet: string;
  price0: string;
  price1: string;
}

interface TokenDayData {
  priceUSD: string;
}
export interface Token {
  id: string;
  name: string;
  symbol: string;
  volumeUSD: string;
  logoURI: string;
  decimals: string;

  // For pool overview
  tokenDayData: TokenDayData[];
  totalValueLockedUSD: string;
  poolCount: number;
}

export interface PoolDayData {
  date: number;
  volumeUSD: string;
  open: string;
  high: string;
  low: string;
  close: string;
}
export interface Pool {
  id: string;
  feeTier: string;
  liquidity: string;
  tick: string;
  sqrtPrice: string;
  token0Price: string;
  token1Price: string;
  feeGrowthGlobal0X128: string;
  feeGrowthGlobal1X128: string;

  // For pool overview
  token0: Token;
  token1: Token;
  totalValueLockedUSD: string;
  poolDayData: PoolDayData[];
}

export interface Position {
  id: string;
  tickLower: {
    tickIdx: string;
    feeGrowthOutside0X128: string;
    feeGrowthOutside1X128: string;
  };
  tickUpper: {
    tickIdx: string;
    feeGrowthOutside0X128: string;
    feeGrowthOutside1X128: string;
  };
  depositedToken0: string;
  depositedToken1: string;
  liquidity: string;
  transaction: {
    timestamp: string;
  };
  collectedFeesToken0: string;
  collectedFeesToken1: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
}

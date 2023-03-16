import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Heading } from "../../common/components/atomic";
import {
  Pool,
  Token,
  PoolDayData,
} from "../../common/interfaces/uniswap.interface";
import { getPools } from "../../repos/uniswap";
import { ScreenWidth } from "../../utils/styled";
import { formatAmount, formatDollarAmount } from "../../utils/format";
import { getFeeTierPercentage } from "../../utils/uniswapv3/helper";
import {
  estimateFee,
  getLiquidityDelta,
  getPriceFromTick,
  getTokensAmountFromDepositAmountUSD,
} from "../../utils/uniswapv3/math";
import BigNumber from "bignumber.js";
import {
  getCurrentNetwork,
  NETWORKS,
  setCurrentNetwork,
} from "../../common/network";
import { usePoolContext } from "../../context/pool/poolContext";
import { PoolActionType } from "../../context/pool/poolReducer";
import TopPoolTable, {
  PoolColumnDataType,
  Risk,
  RiskChecklist,
} from "./TopPoolTable";

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;

  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    padding: 12px;
    border-radius: 12px;
  }
`;
const WrappedHeader = styled.div`
  display: flex;
  justify-content: space-between;

  & > div {
    transform: translateY(0);
    display: flex;
    align-items: center;
    color: red;
    font-size: 0.8rem;
    color: #999;
    height: 25px;
    padding: 12px;
    border-radius: 5rem;
    background: rgba(255, 255, 255, 0.05);
  }
`;
const Total = styled.div`
  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    display: none;
  }
`;

const TopPools = () => {
  const poolContext = usePoolContext();
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [pools, setPools] = useState<PoolColumnDataType[]>([]);
  const chainId = poolContext.state.chain?.id || NETWORKS[0].id;

  const processTopPools = (allPools: Pool[]): PoolColumnDataType[] => {
    const topPools = allPools.map((pool, index) => {
      // Basic Stats
      const poolDayData7d = pool.poolDayData.slice(0, 7);
      const totalValueLockedUSD = Number(pool.totalValueLockedUSD);
      const volume24h = Number(poolDayData7d[0].volumeUSD);
      const volume7d = poolDayData7d.reduce((acc, cur) => {
        return acc + Number(cur.volumeUSD);
      }, 0);
      const dailyVolumePerTVL = volume7d / 7 / totalValueLockedUSD;
      const fee24h = (volume7d / 7) * getFeeTierPercentage(pool.feeTier);
      const dailyFeesPerTVL = fee24h / totalValueLockedUSD;

      // Price Volatility
      const poolDayData14d = pool.poolDayData;
      const priceVolatility24HPercentage: number =
        poolDayData14d
          .map((d: PoolDayData) => {
            return (100 * (Number(d.high) - Number(d.low))) / Number(d.high);
          })
          .reduce((a, b) => a + b, 0) / 14;
      const poolDayDatas = pool.poolDayData;

      // Risk
      const riskChecklist: RiskChecklist = {
        lowPoolTVL: totalValueLockedUSD < 10000000,
        lowPoolVolume: dailyVolumePerTVL < 0.1,
        highPriceVolatility: priceVolatility24HPercentage > 10,
        lowToken0TVL: Number(pool.token0.totalValueLockedUSD) < 10000000,
        lowToken0PoolCount: pool.token0.poolCount < 5,
        lowToken1TVL: Number(pool.token1.totalValueLockedUSD) < 10000000,
        lowToken1PoolCount: pool.token1.poolCount < 5,
      };
      const riskChecklistCount = Object.values(riskChecklist).filter(
        (v) => v === true
      ).length;
      let risk = Risk.SAFE;
      if (riskChecklistCount >= 1) risk = Risk.LOW_RISK;
      if (riskChecklistCount >= 4) risk = Risk.HIGH_RISK;

      // Estimated Profit
      const P = getPriceFromTick(
        Number(pool.tick),
        pool.token0.decimals,
        pool.token1.decimals
      );
      let Pl = P - (P * priceVolatility24HPercentage) / 100;
      let Pu = P + (P * priceVolatility24HPercentage) / 100;
      const priceUSDX = Number(pool.token1.tokenDayData[0].priceUSD);
      const priceUSDY = Number(pool.token0.tokenDayData[0].priceUSD);
      const depositAmountUSD = 1000;
      const { amount0, amount1 } = getTokensAmountFromDepositAmountUSD(
        P,
        Pl,
        Pu,
        priceUSDX,
        priceUSDY,
        depositAmountUSD
      );
      const deltaL = getLiquidityDelta(
        P,
        Pl,
        Pu,
        amount0,
        amount1,
        Number(pool.token0?.decimals || 18),
        Number(pool.token1?.decimals || 18)
      );
      const L = new BigNumber(pool.liquidity);
      const volume24H = volume24h;
      const feeTier = pool.feeTier;
      const estimatedFee24h =
        P >= Pl && P <= Pu ? estimateFee(deltaL, L, volume24H, feeTier) : 0;

      return {
        key: index.toString(),
        poolId: pool.id,
        feeTier: pool.feeTier,
        token0: pool.token0,
        token1: pool.token1,
        totalValueLockedUSD,
        volume24h,
        volume7d,
        dailyVolumePerTVL,
        fee24h,
        priceVolatility24HPercentage,
        poolDayDatas,
        dailyFeesPerTVL,
        risk,
        riskChecklist,
        estimatedFee24h,
        estimatedFeeToken0: amount1,
        estimatedFeeToken1: amount0,
      } as PoolColumnDataType;
    });

    return topPools;
  };

  useEffect(() => {
    const props = {
      featureId: "Pool Overview",
      chainId,
    };
    if (typeof window.plausible !== "undefined") {
      window.plausible("FeatureUsage", {
        props,
      });
    }

    if (poolContext.state.poolsCache[chainId]) {
      setPools(poolContext.state.poolsCache[chainId]);
      setTokens(poolContext.state.tokensCache[chainId]);
      return;
    }

    const tempChain = getCurrentNetwork();
    setCurrentNetwork(poolContext.state.chain || NETWORKS[0]);
    setIsLoading(true);

    const { totalValueLockedUSD_gte, volumeUSD_gte } =
      poolContext.state.chain || NETWORKS[0];

    getPools(totalValueLockedUSD_gte, volumeUSD_gte).then(
      ({ pools, tokens }) => {
        const topPools = processTopPools(pools);
        setPools(topPools);
        setTokens(tokens);
        setIsLoading(false);

        setCurrentNetwork(tempChain);
        poolContext.dispatch({
          type: PoolActionType.SET_POOLS_CACHE,
          payload: {
            chainId: chainId,
            pools: topPools,
          },
        });
        poolContext.dispatch({
          type: PoolActionType.SET_TOKENS_CACHE,
          payload: {
            chainId: chainId,
            tokens,
          },
        });
      }
    );
  }, [poolContext.state.chain]);

  return (
    <Container>
      <WrappedHeader>
        <Heading>Top Pools</Heading>
        <Total>Total: {pools.length} pools</Total>
      </WrappedHeader>

      <div
        style={{
          color: "#999",
          marginTop: 10,
          marginBottom: 20,
          fontSize: "0.875rem",
        }}
      >
        We only display pools that meet the requirements of having a total
        locked value ≥{" "}
        {formatAmount(poolContext.state.chain?.totalValueLockedUSD_gte)} and a
        trading volume ≥{" "}
        {formatDollarAmount(poolContext.state.chain?.volumeUSD_gte)}.
      </div>

      <TopPoolTable isLoading={isLoading} pools={pools} tokens={tokens} />
    </Container>
  );
};

export default TopPools;

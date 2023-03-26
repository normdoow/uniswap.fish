import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Heading } from "../common/components/atomic";
import D3LiquidityHistogram, { Bin } from "./D3LiquidityHistogram";
import { useAppContext } from "../context/app/appContext";
import { getPriceFromTick, getTickFromPrice } from "../utils/uniswapv3/math";
import { AppActionType } from "../context/app/appReducer";
import { divideArray, findMax, findMin } from "../utils/math";
import { ScreenWidth } from "../utils/styled";
import { Price } from "../common/interfaces/coingecko.interface";
import { Tick } from "../common/interfaces/uniswap.interface";

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    border-radius: 12px;
  }
`;
const Padding = styled.div`
  padding: 16px;
  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    padding: 12px;
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

let d3Chart: D3LiquidityHistogram | null = null;
const LiquidityPositionChart = () => {
  const { state, dispatch } = useAppContext();
  const refElement = useRef<HTMLDivElement>(null);

  const processData = (
    ticks: Tick[],
    minTick: number,
    maxTick: number
  ): Bin[] => {
    const bins: Bin[] = [];
    let liquidity = 0;
    for (let i = 0; i < ticks.length - 1; ++i) {
      liquidity += Number(ticks[i].liquidityNet);

      const lowerTick = Number(ticks[i].tickIdx);
      const upperTick = Number(ticks[i + 1].tickIdx);

      if (upperTick > minTick && lowerTick < maxTick) {
        bins.push({
          x0: Number(ticks[i].tickIdx),
          x1: Number(ticks[i + 1].tickIdx),
          y: liquidity,
        });
      }
    }
    return bins;
  };

  const calculateInitialMinMaxTick = (
    ticks: Tick[],
    minimumTick: number,
    maximumTick: number
  ) => {
    const liquidity: Bin[] = [];
    for (let i = 0; i < ticks.length - 1; ++i) {
      liquidity.push({
        x0: Number(ticks[i].tickIdx),
        x1: Number(ticks[i].tickIdx),
        y:
          (liquidity[liquidity.length - 1] || { y: 0 }).y +
          Number(ticks[i].liquidityNet),
      });
    }
    const result = liquidity.filter(
      (b) => b.y > 0 && b.x0 >= minimumTick && b.x0 <= maximumTick
    );
    if (result.length === 0) {
      return { minTick: 0, maxTick: 0 };
    }
    return { minTick: result[0].x0, maxTick: result[result.length - 1].x0 };
  };

  useEffect(() => {
    if (!state.poolTicks || !state.pool || !state.token0 || !state.token1)
      return;

    let width = 500;
    let height = 294;
    if (refElement.current) {
      width = refElement.current.offsetWidth;
    }

    if (d3Chart) d3Chart.destroy();

    const currentPrice = Number(state.pool.token0Price);

    let currentTick = getTickFromPrice(
      currentPrice,
      state.token0.decimals,
      state.token1.decimals
    );
    if (state.isPairToggled) {
      currentTick = -currentTick;
    }
    let minimumTick = getTickFromPrice(
      currentPrice * 0.5,
      state.token0.decimals,
      state.token1.decimals
    );
    let maximumTick = getTickFromPrice(
      currentPrice * 2,
      state.token0.decimals,
      state.token1.decimals
    );
    if (state.isPairToggled) {
      minimumTick = -minimumTick;
      maximumTick = -maximumTick;
    }

    let _ticks = [minimumTick, maximumTick].sort((a, b) => a - b);
    let { minTick, maxTick } = calculateInitialMinMaxTick(
      state.poolTicks,
      _ticks[0],
      _ticks[1]
    );
    let ticks = [minTick, maxTick].sort((a, b) => a - b);
    // Handle case when there is liquidityNet = []; indexing_error
    if (state.poolTicks.length === 2) {
      ticks = _ticks;
    }

    let token0Symbol;
    let token1Symbol;
    if (state.isPairToggled) {
      token0Symbol = state.token1?.symbol;
      token1Symbol = state.token0?.symbol;
    } else {
      token0Symbol = state.token0?.symbol;
      token1Symbol = state.token1?.symbol;
    }

    let token0Decimal;
    let token1Decimal;
    if (state.isPairToggled) {
      token0Decimal = state.token1?.decimals;
      token1Decimal = state.token0?.decimals;
    } else {
      token0Decimal = state.token0?.decimals;
      token1Decimal = state.token1?.decimals;
    }

    const margin = (ticks[1] - ticks[0]) / 10;
    d3Chart = new D3LiquidityHistogram(refElement.current, {
      width,
      height,
      minTick: ticks[0] - margin,
      maxTick: ticks[1] + margin,
      currentTick,
      token0Symbol,
      token1Symbol,
      token0Decimal,
      token1Decimal,
      data: processData(state.poolTicks, ticks[0], ticks[1]),
    });

    // update range
    let minPrice = getPriceFromTick(
      ticks[0],
      state.token0.decimals,
      state.token1.decimals
    );
    let maxPrice = getPriceFromTick(
      ticks[1],
      state.token0.decimals,
      state.token1.decimals
    );
    if (state.isPairToggled) {
      minPrice = getPriceFromTick(
        -ticks[0],
        state.token0.decimals,
        state.token1.decimals
      );
      maxPrice = getPriceFromTick(
        -ticks[1],
        state.token0.decimals,
        state.token1.decimals
      );
    }
    const prices = [minPrice, maxPrice].sort((a, b) => a - b);
    const _p = divideArray(
      (state.token1PriceChart?.prices || []).map((p: Price) => p.value),
      (state.token0PriceChart?.prices || []).map((p: Price) => p.value)
    );
    let _min = findMin(_p);
    let _max = findMax(_p);
    const min = Math.max(_min, prices[0]);
    const max = Math.min(_max, prices[1]);
    dispatch({
      type: AppActionType.UPDATE_PRICE_RANGE,
      payload: [min, max],
    });
    // eslint-disable-next-line
  }, [
    refElement,
    state.poolTicks,
    state.pool,
    state.token0,
    state.token1,
    state.token0PriceChart,
    state.token1PriceChart,
  ]);

  useEffect(() => {
    if (!d3Chart) return;
    if (!state.token0 || !state.token1) return;

    const currentPrice = Number(state.priceAssumptionValue);
    if (!state.isPairToggled) {
      d3Chart.updateCurrentTick(
        getTickFromPrice(
          currentPrice,
          state.token0.decimals,
          state.token1.decimals
        )
      );
    } else {
      d3Chart.updateCurrentTick(
        -getTickFromPrice(
          currentPrice,
          state.token0.decimals,
          state.token1.decimals
        )
      );
    }
    // eslint-disable-next-line
  }, [state.priceAssumptionValue, state.token0, state.token1]);

  useEffect(() => {
    if (!d3Chart) return;
    if (!state.token0 || !state.token1) return;

    let minTick: number;
    let maxTick: number;

    if (!state.isPairToggled) {
      minTick = getTickFromPrice(
        state.priceRangeValue[0],
        state.token0.decimals,
        state.token1.decimals
      );
      maxTick = getTickFromPrice(
        state.priceRangeValue[1],
        state.token0.decimals,
        state.token1.decimals
      );
    } else {
      minTick = -getTickFromPrice(
        state.priceRangeValue[0],
        state.token0.decimals,
        state.token1.decimals
      );
      maxTick = -getTickFromPrice(
        state.priceRangeValue[1],
        state.token0.decimals,
        state.token1.decimals
      );
    }

    d3Chart.updateMinMaxTickRange(minTick, maxTick, state.isFullRange);
    // eslint-disable-next-line
  }, [state.priceRangeValue, state.token0, state.token1, state.isFullRange]);

  return (
    <Container>
      <Padding>
        <WrappedHeader>
          <Heading>Liquidity Position</Heading>
        </WrappedHeader>
      </Padding>

      <div ref={refElement} />
    </Container>
  );
};

export default LiquidityPositionChart;

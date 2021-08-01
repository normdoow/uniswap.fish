import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Heading } from "../common/atomic";
import D3LiquidityHistogram, { Bin } from "./D3LiquidityHistogram";
import { useAppContext } from "../context/app/appContext";
import { Tick } from "../repos/uniswap";
import { divideArray, findMax, findMin } from "../utils/math";
import { getTickFromPrice } from "../utils/liquidityMath";

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
`;
const Padding = styled.div`
  padding: 16px;
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
  const { state } = useAppContext();
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

  useEffect(() => {
    if (
      !state.poolTicks ||
      !state.pool ||
      !state.token0 ||
      !state.token1 ||
      !state.token0PriceChart ||
      !state.token1PriceChart
    )
      return;

    let width = 500;
    let height = 240;
    if (refElement.current) {
      width = refElement.current.offsetWidth;
    }

    if (d3Chart) d3Chart.destroy();

    const prices = divideArray(
      (state.token1PriceChart?.prices || []).map((p) => p.value),
      (state.token0PriceChart?.prices || []).map((p) => p.value)
    );
    const _min = findMin(prices);
    const _max = findMax(prices);
    const margin = (_max - _min) * 1.25;
    const minPrice = _min - margin <= 0 ? _min : _min - margin;
    const maxPrice = _max + margin;
    const currentPrice = Number(state.pool.token0Price);

    let currentTick;
    let minTick;
    let maxTick;

    if (!state.isSwap) {
      currentTick = getTickFromPrice(
        currentPrice,
        state.token0.decimals,
        state.token1.decimals
      );
      minTick = getTickFromPrice(
        minPrice,
        state.token0.decimals,
        state.token1.decimals
      );
      maxTick = getTickFromPrice(
        maxPrice,
        state.token0.decimals,
        state.token1.decimals
      );
    } else {
      currentTick = -getTickFromPrice(
        currentPrice,
        state.token0.decimals,
        state.token1.decimals
      );
      minTick = -getTickFromPrice(
        minPrice,
        state.token0.decimals,
        state.token1.decimals
      );
      maxTick = -getTickFromPrice(
        maxPrice,
        state.token0.decimals,
        state.token1.decimals
      );
    }

    const ticks = [minTick, maxTick].sort((a, b) => a - b);

    let token0Symbol;
    let token1Symbol;
    if (state.isSwap) {
      token0Symbol = state.token1?.symbol;
      token1Symbol = state.token0?.symbol;
    } else {
      token0Symbol = state.token0?.symbol;
      token1Symbol = state.token1?.symbol;
    }

    d3Chart = new D3LiquidityHistogram(refElement.current, {
      width,
      height,
      minTick: ticks[0],
      maxTick: ticks[1],
      currentTick,
      token0Symbol,
      token1Symbol,
      token0Decimal: state.token0.decimals,
      token1Decimal: state.token1.decimals,
      data: processData(state.poolTicks, ticks[0], ticks[1]),
    });
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
    if (!state.isSwap) {
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
  }, [state.priceAssumptionValue, state.token0, state.token1]);

  useEffect(() => {
    if (!d3Chart) return;
    if (!state.token0 || !state.token1) return;

    let minTick: number;
    let maxTick: number;

    if (!state.isSwap) {
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

    d3Chart.updateMinMaxTickRange(minTick, maxTick);
  }, [state.priceRangeValue, state.token0, state.token1]);

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

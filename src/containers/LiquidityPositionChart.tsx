import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Heading } from "../common/atomic";
import { PriceChart } from "../repos/coingecko";
import D3LiquidityHistogram, { Bin } from "./D3LiquidityHistogram";
import { useAppContext } from "../context/app/appContext";
import { Tick } from "../repos/uniswap";
import { getTickFromPrice } from "../utils/math";

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

  const processData = (ticks: Tick[]): Bin[] => {
    const bins: Bin[] = [];
    let liquidity = 0;
    for (let i = 0; i < ticks.length - 1; ++i) {
      liquidity += Number(ticks[i].liquidityNet);

      bins.push({
        x0: Number(ticks[i].tickIdx),
        x1: Number(ticks[i + 1].tickIdx),
        y: liquidity,
      });
    }
    return bins;
  };

  useEffect(() => {
    if (
      !state.poolTicks ||
      !state.token0 ||
      !state.token1 ||
      !state.isPriceAssumptionInit
    )
      return;

    let width = 500;
    let height = 245;
    if (refElement.current) {
      width = refElement.current.offsetWidth;
    }

    if (d3Chart) d3Chart.destroy();

    const currentPrice = Number(state.priceAssumptionValue);
    let currentTick;

    if (state.isSwap) {
      currentTick = getTickFromPrice(currentPrice).toNumber();
    } else {
      currentTick = -getTickFromPrice(currentPrice).toNumber();
    }

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
      minTick: 0,
      maxTick: 0,
      currentTick,
      token0Symbol,
      token1Symbol,
      data: processData(state.poolTicks),
    });
  }, [
    refElement,
    state.poolTicks,
    state.token0,
    state.token1,
    state.isPriceAssumptionInit,
  ]);

  useEffect(() => {
    if (!d3Chart) return;

    const currentPrice = Number(state.priceAssumptionValue);
    if (state.isSwap) {
      d3Chart.updateCurrentTick(getTickFromPrice(currentPrice).toNumber());
    } else {
      d3Chart.updateCurrentTick(-getTickFromPrice(currentPrice).toNumber());
    }
  }, [state.priceAssumptionValue]);

  useEffect(() => {
    if (!d3Chart) return;
    let minTick: number;
    let maxTick: number;

    if (state.isSwap) {
      minTick = getTickFromPrice(state.priceRangeValue[0]).toNumber();
      maxTick = getTickFromPrice(state.priceRangeValue[1]).toNumber();
    } else {
      minTick = -getTickFromPrice(state.priceRangeValue[0]).toNumber();
      maxTick = -getTickFromPrice(state.priceRangeValue[1]).toNumber();
    }

    d3Chart.updateMinMaxTickRange(minTick, maxTick);
  }, [state.priceRangeValue]);

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

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
const Tag = styled.div`
  display: inline-block;
  color: rgba(255, 255, 255, 0.3);
`;
const Stat = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 7px;
`;
const StatItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: #999;
  padding: 3px;

  & > div {
    padding: 3px 12px;
    margin-right: 7px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
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
    if (!state.poolTicks || !state.priceAssumptionValue) return;

    let width = 500;
    let height = 250;
    if (refElement.current) {
      width = refElement.current.offsetWidth;
    }

    if (d3Chart) d3Chart.destroy();

    const currentPrice = Number(state.priceAssumptionValue);

    d3Chart = new D3LiquidityHistogram(refElement.current, {
      width,
      height,
      currentTick: -getTickFromPrice(currentPrice).toNumber(),
      data: processData(state.poolTicks),
    });
  }, [refElement, state.poolTicks, state.priceAssumptionValue]);

  useEffect(() => {
    if (!d3Chart) return;
    const currentPrice = Number(state.priceAssumptionValue);
    d3Chart.updateCurrentTick(-getTickFromPrice(currentPrice).toNumber());
  }, [state.priceAssumptionValue]);

  return (
    <Container>
      <Padding>
        <WrappedHeader>
          <Heading>Liquidity Position</Heading>
        </WrappedHeader>
      </Padding>

      <div ref={refElement} />

      <Padding>
        {/* <Stat>
          <StatItem>
            <div>MIN</div>{" "}
            <span>{findMin(data.map((d) => d.y)).toFixed(4)}</span>
          </StatItem>
          <StatItem>
            <div>MAX</div>{" "}
            <span>{findMax(data.map((d) => d.y)).toFixed(4)}</span>
          </StatItem>
          <StatItem>
            <div>AVG</div>{" "}
            <span>{calculateAvg(data.map((d) => d.y)).toFixed(4)}</span>
          </StatItem>
        </Stat> */}
      </Padding>
    </Container>
  );
};

export default LiquidityPositionChart;

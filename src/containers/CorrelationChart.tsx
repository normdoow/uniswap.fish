import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Heading } from "../common/components";
import D3CorrelationChart, { Point } from "./D3CorrelationChart";
import { useAppContext } from "../context/app/appContext";
import { calculateAvg, findMax, findMin } from "../utils/math";
import { ScreenWidth } from "../utils/styled";
import { PriceChart } from "../common/interfaces/coingecko.interface";

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
const CurrentPrice = styled.div`
  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    display: none;
  }
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

  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    grid-template-columns: repeat(2, 1fr);
  }
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

  &.mobile {
    display: none;

    @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
      display: flex;
    }
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

let d3Chart: D3CorrelationChart | null = null;
const CorrelationChart = () => {
  const { state } = useAppContext();
  const [data, setData] = useState<Point[]>([]);
  const refElement = useRef<HTMLDivElement>(null);

  const processData = (
    token0PriceChart: PriceChart | null,
    token1PriceChart: PriceChart | null
  ): Point[] => {
    if (token0PriceChart === null || token1PriceChart === null) {
      return [];
    }

    const points: Point[] = [];
    const length = Math.min(
      token0PriceChart.prices.length,
      token1PriceChart.prices.length
    );
    for (let i = 0; i < length; ++i) {
      points.push({
        x: token0PriceChart.prices[i].timestamp,
        y: token1PriceChart.prices[i].value / token0PriceChart.prices[i].value,
      });
    }

    return points;
  };

  useEffect(() => {
    if (!state.token0PriceChart || !state.token1PriceChart) return;

    const data = processData(state.token0PriceChart, state.token1PriceChart);
    setData(data);

    let width = 500;
    let height = 300;
    if (refElement.current) {
      width = refElement.current.offsetWidth;
    }

    if (d3Chart) d3Chart.destroy();

    d3Chart = new D3CorrelationChart(refElement.current, {
      data,
      width,
      height,
      minRange: state.priceRangeValue[0],
      maxRange: state.priceRangeValue[1],
      mostActivePrice: state.priceAssumptionValue,
    });
  }, [refElement, state.token0PriceChart, state.token1PriceChart]);

  useEffect(() => {
    if (!d3Chart) return;

    d3Chart.updateMostActivePriceAssumption(state.priceAssumptionValue);
  }, [state.priceAssumptionValue]);

  useEffect(() => {
    if (!d3Chart) return;

    d3Chart.updateMinMaxPriceRange(
      state.priceRangeValue[0],
      state.priceRangeValue[1]
    );
  }, [state.priceRangeValue]);

  if (state.token0PriceChart === null || state.token1PriceChart === null) {
    return <></>;
  }

  return (
    <Container>
      <Padding>
        <WrappedHeader>
          <Heading>
            {state.token0?.symbol} / {state.token1?.symbol} Correlation{" "}
            <Tag>(1 month)</Tag>
          </Heading>

          <CurrentPrice>
            Price: {Number(state.pool?.token0Price).toFixed(2)}{" "}
            {state.token0?.symbol} / {state.token1?.symbol}
          </CurrentPrice>
        </WrappedHeader>
      </Padding>

      <div ref={refElement} />

      <Padding>
        <Stat>
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
          <StatItem className="mobile">
            <div>$$$</div>{" "}
            <span>
              {Number(state.pool?.token0Price).toFixed(2)}{" "}
              {state.token0?.symbol} / {state.token1?.symbol}
            </span>
          </StatItem>
        </Stat>
      </Padding>
    </Container>
  );
};

export default CorrelationChart;

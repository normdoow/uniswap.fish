import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Heading } from "../common/atomic";
import { getPriceChart, Price, PriceChart } from "../repos/coingecko";
import D3PriceChart, { Point } from "../common/D3PriceChart";

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

let d3Chart: D3PriceChart | null = null;
const CorrelationChart = () => {
  const [data, setData] = useState<PriceChart | null>(null);
  const [mostActivePrice, setMostActivePrice] = useState<number>(2000);

  const refElement = useRef<HTMLDivElement>(null);

  const processData = (data: PriceChart): Point[] => {
    return data.prices.reduce((result: Point[], curr: Price) => {
      return [...result, { x: curr.timestamp, y: curr.value }];
    }, []);
  };

  const fetchData = async () => {
    const tokenPrice1 = await getPriceChart(
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    );
    setData(tokenPrice1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;

    let width = 500;
    let height = 250;
    if (refElement.current) {
      width = refElement.current.offsetWidth;
    }

    d3Chart = new D3PriceChart(refElement.current, {
      data: processData(data),
      width,
      height,
      mostActivePrice,
    });
  }, [data, refElement]);

  useEffect(() => {
    if (!mostActivePrice) return;
    if (!d3Chart) return;

    d3Chart.renderMostActivePriceAssumption(mostActivePrice);
  }, [mostActivePrice]);

  return (
    <Container>
      <Padding>
        <WrappedHeader>
          <Heading>
            UNI / ETH Correlation Chart <Tag>(1mth)</Tag>
          </Heading>

          <div>Current Price: 123.21</div>
        </WrappedHeader>
      </Padding>

      <div ref={refElement} />

      <Padding>
        <Stat>
          <StatItem>
            <div>MIN</div> <span>12312.23</span>
          </StatItem>
          <StatItem>
            <div>MAX</div> <span>512312.23</span>
          </StatItem>
          <StatItem>
            <div>AVG</div> <span>15322.23</span>
          </StatItem>
        </Stat>
      </Padding>
    </Container>
  );
};

export default CorrelationChart;

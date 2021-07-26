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

  & > div {
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
  }

  & > div:nth-child(3) {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 5rem;
  }
`;

let vis: D3PriceChart | null = null;
const CorrelationChart = () => {
  const [data, setData] = useState<any>(null);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(300);

  const refElement = useRef(null);

  const processData = (data: PriceChart): Point[] => {
    return data.prices.reduce((result: Point[], curr: Price) => {
      return [...result, { x: curr.timestamp, y: curr.value }];
    }, []);
  };

  const fetchData = async () => {
    const tokenPrice1 = await getPriceChart(
      "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"
    );

    vis = new D3PriceChart(refElement.current, {
      data: processData(tokenPrice1),
      width,
      height,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (data && data.length) {
  //     vis = new D3PriceChart(refElement.current, { data, width, height });
  //   }
  // }, [data]);

  // useEffect(() => {
  //   let resizeTimer: NodeJS.Timeout;
  //   const handleResize = () => {
  //     clearTimeout(resizeTimer);
  //     resizeTimer = setTimeout(function () {
  //       setWidth(window.innerWidth);
  //       setHeight(window.innerHeight);
  //     }, 300);
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // useEffect(() => {
  //   // vis && vis.resize(width, height);
  // }, [width, height]);

  return (
    <Container>
      <Padding>
        <Heading>
          UNI / ETH Correlation Chart <Tag>(1 month)</Tag>
        </Heading>
      </Padding>

      <div ref={refElement} />

      <Padding>
        <Stat>
          <div>
            <div>MIN</div> <span>12312.23 UNI/ETH</span>
          </div>
          <div>
            <div>MAX</div> <span>512312.23 UNI/ETH</span>
          </div>
          <div>
            <div>AVG</div> <span>15322.23 UNI/ETH</span>
          </div>
        </Stat>
      </Padding>
    </Container>
  );
};

export default CorrelationChart;

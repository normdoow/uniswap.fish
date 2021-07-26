import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Heading } from "../common/atomic";
import Table from "../common/Table";
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
        <Table>
          <div>Minimum Value</div>
          <div>90.00012310</div>
          <div>UNI/ETH</div>
        </Table>
        <Table>
          <div>Maximum Value</div>
          <div>110.123213123</div>
          <div>UNI/ETH</div>
        </Table>
        <Table>
          <div>Average Value</div>
          <div>100.123213123</div>
          <div>UNI/ETH</div>
        </Table>
      </Padding>
    </Container>
  );
};

export default CorrelationChart;

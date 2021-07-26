import React, { useEffect } from "react";
import styled from "styled-components";
import { Heading } from "../common/atomic";
import Table from "../common/Table";
import { getPriceChart } from "../repos/coingecko";

const SettingContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
`;
const Fee = styled.span`
  display: block;
  color: rgb(37, 175, 96);
  font-weight: 500;
  font-size: 2.6rem;
  margin-top: -10px;
`;
const Tag = styled.div`
  display: inline-block;
  color: rgba(255, 255, 255, 0.3);
`;

const CorrelationChart = () => {
  useEffect(() => {
    getPriceChart("0xa4cf2afd3b165975afffbf7e487cdd40c894ab6b").then(
      console.log
    );
  }, []);

  return (
    <SettingContainer>
      <Heading>
        UNI / ETH Correlation Chart <Tag>(1 month)</Tag>
      </Heading>
      <Fee>
        <span>$</span>42.15
      </Fee>

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
    </SettingContainer>
  );
};

export default CorrelationChart;

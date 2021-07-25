import React from "react";
import styled from "styled-components";
import { Heading } from "../common/atomic";

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
const Table = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 5rem 1fr 5rem;
  grid-gap: 7px;

  padding: 6px 12px;
  margin-top: 7px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #999;

  & > div:nth-child(2) {
    text-align: right;
  }
  & > div:nth-child(3) {
    text-align: left;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 5rem;
    text-align: center;
  }
`;

const EstimatedFees = () => {
  return (
    <SettingContainer>
      <Heading>
        Estimated Fees <Tag>(Daily)</Tag>
      </Heading>
      <Fee>
        <span>$</span>42.15
      </Fee>
      <Table>
        <div>DAILY</div>
        <div>$42.15</div>
        <div>0.01%</div>
      </Table>
      <Table>
        <div>APR</div>
        <div>$505.80</div>
        <div>10.00%</div>
      </Table>
      <Table>
        <div>APY</div>
        <div>$1505.80</div>
        <div>1233.23%</div>
      </Table>
    </SettingContainer>
  );
};

export default EstimatedFees;

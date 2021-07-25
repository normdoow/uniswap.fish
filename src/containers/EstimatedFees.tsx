import React from "react";
import styled from "styled-components";
import { Heading } from "../common/atomic";
import Table from "../common/Table";

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

const EstimatedFees = () => {
  return (
    <SettingContainer>
      <Heading>
        Estimated Fees <Tag>(24h)</Tag>
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
    </SettingContainer>
  );
};

export default EstimatedFees;

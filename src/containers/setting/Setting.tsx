import React from "react";
import styled from "styled-components";
import DepositAmounts from "./DepositAmounts";
import PriceRange from "./PriceRange";

const SettingContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
`;
const Br = styled.div`
  height: 10px;
`;
const Setting = () => {
  return (
    <SettingContainer>
      <DepositAmounts />
      <Br />
      <DepositAmounts />
      <Br />
      <PriceRange />
    </SettingContainer>
  );
};

export default Setting;

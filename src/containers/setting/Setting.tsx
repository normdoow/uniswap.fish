import React from "react";
import styled from "styled-components";
import DepositAmounts from "./DepositAmounts";
import FeeTiers from "./FeeTiers";
import PriceRange from "./PriceRange";

const SettingContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
`;
const Br = styled.div`
  height: 20px;
`;
const Setting = () => {
  return (
    <SettingContainer>
      <DepositAmounts />
      <Br />
      <FeeTiers />
      <Br />
      <PriceRange />
    </SettingContainer>
  );
};

export default Setting;

import React from "react";
import styled from "styled-components";
import { Br } from "../../common/atomic";
import DepositAmounts from "./DepositAmounts";
import PriceRange from "./PriceRange";
// import OutOfRangePercentage from "./OutOfRangePercentage";

const SettingContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
`;

const Setting = () => {
  return (
    <SettingContainer>
      <DepositAmounts />
      <Br />
      <PriceRange />
      {/* <Br />
      <OutOfRangePercentage /> */}
    </SettingContainer>
  );
};

export default Setting;

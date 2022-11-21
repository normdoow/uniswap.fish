import React from "react";
import styled from "styled-components";
import { Br } from "../../common/components";
import { ScreenWidth } from "../../utils/styled";
import DepositAmount from "./DepositAmount";
import PriceRange from "./PriceRange";

const SettingContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;

  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    padding: 12px;
    border-radius: 12px;
  }
`;

const Setting = () => {
  return (
    <SettingContainer>
      <DepositAmount />
      <Br />
      <PriceRange />
    </SettingContainer>
  );
};

export default Setting;

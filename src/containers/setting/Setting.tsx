import React from "react";
import styled from "styled-components";
import DepositAmounts from "./DepositAmounts";

const SettingContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
`;
const Br = styled.div`
  height: 7px;
`;
const Setting = () => {
  return (
    <SettingContainer>
      <DepositAmounts />
      <Br />
      <DepositAmounts />
      <Br />
      <DepositAmounts />
    </SettingContainer>
  );
};

export default Setting;

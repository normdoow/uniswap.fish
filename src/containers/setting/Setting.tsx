import React from "react";
import styled from "styled-components";
import { Br, PrimaryDarkBlockButton } from "../../common/components/atomic";
import { useModalContext } from "../../context/modal/modalContext";
import { ModalActionType } from "../../context/modal/modalReducer";
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
  const modalContext = useModalContext();

  return (
    <SettingContainer>
      <DepositAmount />
      <Br />
      <PriceRange />
      <Br />
      <PrimaryDarkBlockButton
        onClick={() => {
          modalContext.dispatch({
            type: ModalActionType.SET_CREATE_POSITION_MODAL_STATE,
            payload: true,
          });
        }}
      >
        Create Position
      </PrimaryDarkBlockButton>
    </SettingContainer>
  );
};

export default Setting;

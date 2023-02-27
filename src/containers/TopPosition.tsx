import React from "react";
import styled from "styled-components";
import {
  Br,
  Heading,
  PrimaryDarkBlockButton,
} from "../common/components/atomic";
import { useModalContext } from "../context/modal/modalContext";
import { ModalActionType } from "../context/modal/modalReducer";
import { ScreenWidth } from "../utils/styled";

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;

  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    padding: 12px;
    border-radius: 12px;
  }
`;
const WrappedHeader = styled.div`
  display: flex;
  justify-content: space-between;

  & > div {
    transform: translateY(0);
    display: flex;
    align-items: center;
    color: red;
    font-size: 0.8rem;
    color: #999;
    height: 25px;
    padding: 12px;
    border-radius: 5rem;
    background: rgba(255, 255, 255, 0.05);
  }
`;
const Total = styled.div`
  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    display: none;
  }
`;

const TopPosition = () => {
  const modalContext = useModalContext();

  return (
    <Container>
      <WrappedHeader>
        <Heading>Top Positions</Heading>
        <Total>Total: 1250 positions</Total>
      </WrappedHeader>
      <PrimaryDarkBlockButton
        onClick={() => {
          modalContext.dispatch({
            type: ModalActionType.SET_CREATE_POSITION_MODAL_STATE,
            payload: true,
          });
        }}
      >
        Calculate Top Positions
      </PrimaryDarkBlockButton>
    </Container>
  );
};

export default TopPosition;

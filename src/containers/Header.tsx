import React from "react";
import {
  faCoins,
  faExchangeAlt,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { Button, PrimaryButton } from "../common/components/atomic";
import { useAppContext } from "../context/app/appContext";
import { AppActionType } from "../context/app/appReducer";
import { useModalContext } from "../context/modal/modalContext";
import { ModalActionType } from "../context/modal/modalReducer";
import { ScreenWidth } from "../utils/styled";

const InvisibleMobileSpan = styled.span`
  @media only screen and (max-width: 430px) {
    display: none;
  }
`;
const InvisibleTabletSpan = styled.span`
  @media only screen and (max-width: 610px) {
    display: none;
  }
`;
const ButtonIcon = styled.span`
  margin-right: 7px;

  @media only screen and (max-width: 610px) {
    margin-right: 0;
    font-size: 1.2rem;
  }
`;
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;
const FeePercentage = styled.span`
  font-size: 1rem;
  padding: 1px 5px;
  border-radius: 5px;
  font-weight: 400;
  color: #999;
  margin-left: 7px;
  background: rgba(255, 255, 255, 0.15);
`;
const PairToken = styled.div`
  display: flex;
  align-items: center;

  & > div {
    margin-right: 7px;
    & img {
      height: 30px;
      border-radius: 50%;
      transform: translateY(2.5px);

      @media only screen and (max-width: ${ScreenWidth.TABLET}px) {
        height: 25px;
      }
    }
    & img:nth-child(2) {
      margin-left: -15px;
      @media only screen and (max-width: ${ScreenWidth.TABLET}px) {
        margin-left: calc(-1 * 25px / 2);
      }
    }
  }

  & h2 {
    margin: 0;
    font-size: 1.2rem;
    display: block;

    @media only screen and (max-width: ${ScreenWidth.TABLET}px) {
      font-size: 1rem;
    }

    & svg {
      color: #999;
      font-size: 0.8rem;
      transform: translateX(7px) translateY(-6px);
    }
  }
`;

const Header = () => {
  const appContext = useAppContext();
  const modalContext = useModalContext();

  return (
    <HeaderContainer>
      <PairToken>
        <div>
          <img
            src={appContext.state.token0?.logoURI}
            alt={appContext.state.token0?.name}
          />
          <img
            src={appContext.state.token1?.logoURI}
            alt={appContext.state.token1?.name}
          />
        </div>
        <h2>
          <span>
            {appContext.state.token0?.symbol} /{" "}
            {appContext.state.token1?.symbol}
          </span>
          <FeePercentage>
            {appContext.state.pool?.feeTier === "100" && <span>0.01%</span>}
            {appContext.state.pool?.feeTier === "500" && <span>0.05%</span>}
            {appContext.state.pool?.feeTier === "3000" && <span>0.3%</span>}
            {appContext.state.pool?.feeTier === "10000" && <span>1%</span>}
          </FeePercentage>
          <InvisibleMobileSpan>
            <FeePercentage>{appContext.state.network.name}</FeePercentage>
          </InvisibleMobileSpan>
          <a
            href={`https://info.uniswap.org/#/${appContext.state.network.id}/pools/${appContext.state.pool?.id}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Open in Uniswap"
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        </h2>
      </PairToken>
      <div>
        <Button
          style={{ marginRight: 7 }}
          onClick={() => {
            appContext.dispatch({
              type: AppActionType.TOGGLE_CURRENT_PAIR,
            });
          }}
        >
          <ButtonIcon>
            <FontAwesomeIcon icon={faExchangeAlt} />
          </ButtonIcon>
          <InvisibleTabletSpan>Toggle Pair</InvisibleTabletSpan>
        </Button>
        <PrimaryButton
          onClick={() => {
            modalContext.dispatch({
              type: ModalActionType.SET_SELECT_PAIR_MODAL_STATE,
              payload: true,
            });
          }}
        >
          <ButtonIcon>
            <FontAwesomeIcon icon={faCoins} />
          </ButtonIcon>
          <InvisibleTabletSpan>Change Pool</InvisibleTabletSpan>
        </PrimaryButton>
      </div>
    </HeaderContainer>
  );
};

export default Header;

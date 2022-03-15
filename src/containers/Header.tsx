import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import { Button, PrimaryButton } from "../common/buttons";
import { useAppContext } from "../context/app/appContext";
import { AppActionType } from "../context/app/appReducer";
import { useModalContext } from "../context/modal/modalContext";
import { ModalActionType } from "../context/modal/modalReducer";

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
    }
    & img:nth-child(2) {
      margin-left: -15px;
    }
  }

  & h2 {
    margin: 0;
    font-size: 1.2rem;
    display: block;

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
              type: AppActionType.SWAP_CURRENT_PAIR,
            });
          }}
        >
          Swap Current Pair
        </Button>
        <PrimaryButton
          onClick={() => {
            modalContext.dispatch({
              type: ModalActionType.SET_SELECT_PAIR_MODAL_STATE,
              payload: true,
            });
          }}
        >
          Change Pair
        </PrimaryButton>
      </div>
    </HeaderContainer>
  );
};

export default Header;

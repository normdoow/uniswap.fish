import React, { useState } from "react";
import Modal from "react-modal";
import { useModalContext } from "../context/modal/modalContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ModalActionType } from "../context/modal/modalReducer";
import ReactTooltip from "react-tooltip";
import { Br, PrimaryDarkBlockButton } from "../common/components/atomic";
import { useAppContext } from "../context/app/appContext";

const ModalStyle = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.9)",
    zIndex: 99999,
  },
  content: {
    border: 0,
    padding: 0,
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    borderRadius: "16px",
    marginRight: "calc(-50% + 30px)",
    transform: "translate(-50%, -50%)",
    background: "rgb(28, 27, 28)",
  },
};
const Container = styled.div`
  width: 370px;
  padding: 15px;
`;
const Header = styled.h1`
  color: white;
  margin: 0;
  font-weight: bold;
  font-size: 1.1rem;
  color: #ddd;
  font-weight: 500;
  display: flex;
  padding: 15px;
  align-items: center;
  background: rgb(50, 50, 50);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  & span:nth-child(1) {
    font-size: 1.1rem;
  }
  & span:nth-child(2) {
    cursor: pointer;
    margin-right: 7px;
  }
`;

const InputGroup = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);

  & .fiat {
    color: #999;
    margin-left: 12px;
    margin-top: -7px;
    margin-bottom: 10px;
    font-size: 0.785rem;
  }

  & .amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;

    & input {
      background: transparent;
      border: 0;
      outline: none;
      color: white;
      font-size: 24px;
      font-weight: 500;
      width: 200px;
    }
    & .token {
      color: white;
      display: flex;
      align-items: center;
      font-weight: bold;

      background: rgba(255, 255, 255, 0.1);
      padding: 3px;
      padding-right: 8px;
      border-radius: 5rem;

      & img {
        width: 25px;
        height: 25px;
        margin-right: 5px;
        border-radius: 50%;
      }
    }
  }
`;

interface DepositAmountSectionProps {
  onSubmit: (token0Amount: number, token1Amount: number) => void;
}
const DepositAmountSection = ({ onSubmit }: DepositAmountSectionProps) => {
  const appContext = useAppContext();
  const [token0Amount, setToken0Amount] = useState<number | null>(null);
  const [token1Amount, setToken1Amount] = useState<number | null>(null);

  const token0USDValue =
    (token0Amount || 0) *
    (appContext.state.token0PriceChart?.currentPriceUSD || 0);
  const token1USDValue =
    (token1Amount || 0) *
    (appContext.state.token1PriceChart?.currentPriceUSD || 0);

  const isFormDisabled =
    (token0Amount || 0) < 0 ||
    (token1Amount || 0) < 0 ||
    token0USDValue + token1USDValue === 0;

  const handleSubmit = () => {
    if (isFormDisabled) return;
    onSubmit(token0Amount || 0, token1Amount || 0);
  };

  return (
    <>
      <span style={{ color: "#999", fontSize: "0.875rem" }}>
        Please specify the amount of token you want to deposit into the
        position.
      </span>
      <Br />
      <InputGroup style={{ marginBottom: 8 }}>
        <div className="amount">
          <input
            type="number"
            placeholder="0"
            onChange={(e) => setToken0Amount(Number(e.target.value))}
          />
          <div className="token">
            <img src={appContext.state.token0?.logoURI} />
            <span>{appContext.state.token0?.symbol}</span>
          </div>
        </div>
        <div className="fiat">${token0USDValue.toFixed(2)}</div>
      </InputGroup>
      <InputGroup>
        <div className="amount">
          <input
            type="number"
            placeholder="0"
            onChange={(e) => setToken1Amount(Number(e.target.value))}
          />
          <div className="token">
            <img src={appContext.state.token1?.logoURI} />
            <span>{appContext.state.token1?.symbol}</span>
          </div>
        </div>
        <div className="fiat">${token1USDValue.toFixed(2)}</div>
      </InputGroup>
      <Br />
      <PrimaryDarkBlockButton
        onClick={handleSubmit}
        disabled={isFormDisabled}
        style={
          isFormDisabled
            ? {
                background: "rgba(255, 255, 255, 0.1)",
                color: "#999",
                cursor: "not-allowed",
              }
            : {}
        }
      >
        Calculate Swap Route
      </PrimaryDarkBlockButton>
    </>
  );
};

const CreatePositionModal = () => {
  const { state, dispatch } = useModalContext();
  const [token0Amount, setToken0Amount] = useState<number | null>(null);
  const [token1Amount, setToken1Amount] = useState<number | null>(null);

  return (
    <>
      <Modal
        style={ModalStyle}
        isOpen={state.isCreatePositionModalOpen}
        contentLabel="CREATE POSITION"
        ariaHideApp={false}
      >
        <>
          <ReactTooltip id="create-position" />
          <Header>
            <span>
              Create Position
              <FontAwesomeIcon
                style={{ opacity: 0.3, marginLeft: 5 }}
                data-for="create-position"
                data-place="bottom"
                data-html={true}
                data-tip={`This feature will instruct you how to create a position and help you calculate the deposit tokens amount for current price range setting.
                <br>
                Noted that there is no smart contract risk evolve using this feature since you will be the one who creates a new position yourself on the official Uniswap interface. This feature only gives you "Instruction."`}
                icon={faQuestionCircle}
              />
            </span>
            <span
              onClick={() => {
                dispatch({
                  type: ModalActionType.SET_CREATE_POSITION_MODAL_STATE,
                  payload: false,
                });
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </Header>
          <Container>
            <DepositAmountSection
              onSubmit={(token0Amount, token1Amount) => {
                setToken0Amount(token0Amount);
                setToken1Amount(token1Amount);
              }}
            />
          </Container>
        </>
      </Modal>
    </>
  );
};

export default CreatePositionModal;

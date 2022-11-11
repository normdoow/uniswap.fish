import Modal from "react-modal";
import { useModalContext } from "../context/modal/modalContext";
import styled from "styled-components";
import { ModalActionType } from "../context/modal/modalReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Group, Input, InputGroup } from "../common/input";
import Slider from "./setting/Slider";
import { Dollar } from "../common/components";
import { useAppContext } from "../context/app/appContext";
import { useEffect, useState } from "react";
import { AppActionType } from "../context/app/appReducer";
import { divideArray, findMax, findMin } from "../utils/math";
import { Price } from "../common/interfaces/coingecko.interface";
import { getTokensAmountFromDepositAmountUSD } from "../utils/uniswapv3/math";

const ModalStyle = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.9)",
    zIndex: 99999999,
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
    background: "rgb(22, 22, 22)",
  },
};
const Container = styled.div`
  min-width: 370px;
  padding: 12px 10px;
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
  background: rgb(40, 40, 40);
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
const StrategyContainer = styled.div`
  position: relative;
  & > div:nth-child(1) {
    margin-bottom: 10px;
  }
`;
const Strategy = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;

  & > span.badge {
    position: absolute;
    font-size: 0.8rem;
    border-radius: 5px;
    padding: 1px 5px;
    font-weight: bold;
  }
  & > span.value {
    color: white;
    font-size: 1.4rem;
    display: flex;
    justify-content: right;
    margin-top: -9px;
    transform: translateY(2px) translateX(-3px);

    & > span.p {
      font-size: 0.8rem;
      margin-right: 8px;
      margin-top: 11px;
      color: #25af60;
      font-weight: bold;
    }
  }
  & > ${Dollar} {
    background: red;
  }
`;

const Token = styled.div`
  display: flex;
  align-items: center;

  & > img {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    transform: translateX(-5px);
  }
`;
export const Table = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 5px;
  margin-top: 3px;

  padding: 6px 12px;
  &.adjust-padding-right {
    padding-right: 6px;
  }
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #aaa;

  & > div {
    display: grid;
    grid-template-columns: 8rem 1fr 5rem;
    grid-gap: 7px;

    & > div:nth-child(2) {
      text-align: right;
    }
    & > div:nth-child(3) {
      text-align: left;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 5rem;
      text-align: center;
    }
  }
`;
// TODO: Refactor this CSS
const FuturePriceContainer = styled.div`
  display: grid;
  grid-gap: 7px;
  grid-template-columns: repeat(2, 1fr);
`;
export const FuturePriceInputGroup = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.175);
  padding: 6px 8px;
  border-radius: 12px;
  position: relative;
  margin-bottom: 2px;

  & > span.heading {
    font-size: 0.8rem;
    color: #bbb;
    display: block;
    border-bottom: 1px solid rgba(255, 255, 255, 0.175);
    font-weight: bold;
    padding-bottom: 6px;
  }

  & > div.group {
    & > span {
      margin-top: 6px;
      display: block;
      color: #999;
      font-size: 0.8rem;
      margin-bottom: 3px;
    }

    & > div.price-input-container {
      display: flex;
      align-items: center;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.075);
      padding: 3px 6px;

      & > span {
        color: white;
        font-size: 1.1rem;
        margin-right: 3px;
        font-family: sans-serif;
        font-weight: bold;
        transform: translateY(-1.5px);
      }
    }
  }
`;
const PriceInput = styled.input`
  display: block;
  width: 110px;
  border: 0;
  background: transparent;
  color: white;
  font-weight: 600;
  font-size: 1rem;

  &:focus {
    outline: none;
  }
`;

const ImpermanentLossModal = () => {
  const modalContext = useModalContext();
  const { state, dispatch } = useAppContext();

  // TODO: Refactor calculation logic & pref
  const initialPrice: number[] = [
    state.token0PriceChart?.prices[state.token0PriceChart?.prices.length - 1]
      .value || 0,
    state.token1PriceChart?.prices[state.token1PriceChart?.prices.length - 1]
      .value || 0,
  ];
  const currentPrice = state.currentPrice || initialPrice;
  const futurePrice = state.futurePrice || initialPrice;

  const calculateTokensAmount = (pricesUSD: number[]) => {
    const P = pricesUSD[1] / pricesUSD[0];
    let Pl = state.priceRangeValue[0];
    let Pu = state.priceRangeValue[1];
    const priceUSDX = state.token1PriceChart?.currentPriceUSD || 1;
    const priceUSDY = state.token0PriceChart?.currentPriceUSD || 1;
    const depositAmountUSD = state.depositAmountValue;

    if (state.isFullRange && state.poolTicks) {
      const firstTick = state.poolTicks[0];
      const lastTick = state.poolTicks[state.poolTicks.length - 1];
      Pl = Number(firstTick.price0);
      Pu = Number(lastTick.price0);
    }

    // TODO: Refactor (amt0, amt1 confusion)
    const { amount0, amount1 } = getTokensAmountFromDepositAmountUSD(
      P,
      Pl,
      Pu,
      priceUSDX,
      priceUSDY,
      depositAmountUSD
    );

    return { price: P, amount0, amount1 };
  };

  const current = calculateTokensAmount(currentPrice);
  const future = calculateTokensAmount(futurePrice);

  const futurePrice0Percentage =
    (100 * (futurePrice[0] - currentPrice[0])) / currentPrice[0];
  const futurePrice1Percentage =
    (100 * (futurePrice[1] - currentPrice[1])) / currentPrice[1];

  const valueUSDToken0 = 9;
  const valueUSDToken1 = 10;

  return (
    <>
      <Modal
        style={ModalStyle}
        isOpen={modalContext.state.isImpermanentLossModalOpen}
        contentLabel="Impermanent Loss Calculator"
        ariaHideApp={false}
      >
        <>
          <Header>
            <span>Impermanent Loss Calculator</span>
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                modalContext.dispatch({
                  type: ModalActionType.SET_IMPERMANENT_LOSS_MODAL_STATE,
                  payload: false,
                })
              }
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </Header>
          <Container>
            <StrategyContainer>
              <Strategy>
                <span
                  className="badge"
                  style={{
                    background: "rgba(20, 112, 241, 0.175)",
                    color: "#4190ff",
                  }}
                >
                  Strategy A: HODL
                </span>
                <span className="value">
                  <span className="p">+25%</span>
                  <Dollar style={{ fontSize: "1.5rem" }}>$</Dollar>
                  10025.14
                </span>
                <Table className="adjust-padding-right">
                  <div>
                    <Token>
                      <img
                        alt={state.token0?.name}
                        src={state.token0?.logoURI}
                      />{" "}
                      <span>{state.token0?.symbol}</span>
                    </Token>
                    <div>{current.amount1.toFixed(5)}</div>
                    <div>${valueUSDToken0.toFixed(2)}</div>
                  </div>
                  <div>
                    <Token>
                      <img
                        alt={state.token1?.name}
                        src={state.token1?.logoURI}
                      />{" "}
                      <span>{state.token1?.symbol}</span>
                    </Token>
                    <div>{current.amount0.toFixed(5)}</div>
                    <div>${valueUSDToken1.toFixed(2)}</div>
                  </div>
                </Table>
              </Strategy>

              <Strategy>
                <span
                  className="badge"
                  style={{
                    background: "rgba(252, 7, 125, 0.175)",
                    color: "#ff69b2",
                  }}
                >
                  Strategy B: UNIV3
                </span>
                <span className="value">
                  <span className="p">+25%</span>
                  <Dollar style={{ fontSize: "1.5rem" }}>$</Dollar>
                  10025.14
                </span>
                <Table className="adjust-padding-right">
                  <div>
                    <Token>
                      <img
                        alt={state.token0?.name}
                        src={state.token0?.logoURI}
                      />{" "}
                      <span>{state.token0?.symbol}</span>
                    </Token>
                    <div>1000</div>
                    <div>$1000</div>
                  </div>
                  <div>
                    <Token>
                      <img
                        alt={state.token1?.name}
                        src={state.token1?.logoURI}
                      />{" "}
                      <span>{state.token1?.symbol}</span>
                    </Token>
                    <div>1000</div>
                    <div>$1000</div>
                  </div>
                  <div>
                    <div>LP Yield (12.25d)</div>
                    <div>5.25%</div>
                    <div>$1000</div>
                  </div>
                </Table>
              </Strategy>
            </StrategyContainer>

            <Table style={{ marginTop: 10, color: "white" }}>
              <div>
                <div>Impermanent Loss</div>
                <div>-$5000</div>
                <div>-10%</div>
              </div>
              <div>
                <div>PnL (12.25d)</div>
                <div>+$259</div>
                <div>+10%</div>
              </div>
            </Table>

            <Group style={{ marginTop: 10 }}>
              <InputGroup>
                <div
                  className="btn btn-left"
                  onClick={() => {
                    dispatch({
                      type: AppActionType.SET_DAYS_IN_POSITION,
                      payload: state.daysInPosition - 0.25,
                    });
                  }}
                >
                  <span>-</span>
                </div>
                <div
                  className="btn btn-right"
                  onClick={() => {
                    dispatch({
                      type: AppActionType.SET_DAYS_IN_POSITION,
                      payload: state.daysInPosition + 0.25,
                    });
                  }}
                >
                  <span>+</span>
                </div>
                <span style={{ color: "#bbb", fontWeight: "bold" }}>
                  Number of Days in the Position
                </span>
                <Input
                  value={state.daysInPosition}
                  type="number"
                  placeholder="0.0"
                  onChange={(e) => {
                    let value = Number(e.target.value);

                    dispatch({
                      type: AppActionType.SET_DAYS_IN_POSITION,
                      payload: value,
                    });
                  }}
                />
                <span>You need to be in the position ≥ 12.25d to profit</span>
              </InputGroup>

              <FuturePriceContainer>
                <FuturePriceInputGroup style={{ marginTop: 8 }}>
                  <span className="heading">Current Price</span>
                  <div className="group">
                    <span>{state.token0?.symbol} Price (USD)</span>
                    <div className="price-input-container">
                      <Dollar>$</Dollar>
                      <PriceInput
                        defaultValue={currentPrice[0]}
                        type="number"
                        placeholder="0.00"
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          if (value < 0) value = 0;

                          dispatch({
                            type: AppActionType.SET_CURRENT_PRICE,
                            payload: [value, currentPrice[1]],
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="group">
                    <span>{state.token1?.symbol} Price (USD)</span>
                    <div className="price-input-container">
                      <Dollar>$</Dollar>
                      <PriceInput
                        defaultValue={currentPrice[1]}
                        type="number"
                        placeholder="0.00"
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          if (value < 0) value = 0;

                          dispatch({
                            type: AppActionType.SET_CURRENT_PRICE,
                            payload: [currentPrice[0], value],
                          });
                        }}
                      />
                    </div>
                  </div>
                </FuturePriceInputGroup>

                <FuturePriceInputGroup style={{ marginTop: 8 }}>
                  <span className="heading">Future Price</span>
                  <div className="group">
                    <span>
                      {state.token0?.symbol} Price (
                      {futurePrice0Percentage >= 0 ? "+" : ""}
                      {futurePrice0Percentage.toFixed(2)}%)
                    </span>
                    <div className="price-input-container">
                      <Dollar>$</Dollar>
                      <PriceInput
                        defaultValue={futurePrice[0]}
                        type="number"
                        placeholder="0.00"
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          if (value < 0) value = 0;

                          dispatch({
                            type: AppActionType.SET_FUTURE_PRICE,
                            payload: [value, futurePrice[1]],
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="group">
                    <span>
                      {state.token1?.symbol} Price (
                      {futurePrice1Percentage >= 0 ? "+" : ""}
                      {futurePrice1Percentage.toFixed(2)}%)
                    </span>
                    <div className="price-input-container">
                      <Dollar>$</Dollar>
                      <PriceInput
                        defaultValue={futurePrice[1]}
                        type="number"
                        placeholder="0.00"
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          if (value < 0) value = 0;

                          dispatch({
                            type: AppActionType.SET_FUTURE_PRICE,
                            payload: [futurePrice[0], value],
                          });
                        }}
                      />
                    </div>
                  </div>
                </FuturePriceInputGroup>
              </FuturePriceContainer>
            </Group>
          </Container>
        </>
      </Modal>
    </>
  );
};

export default ImpermanentLossModal;

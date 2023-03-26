import React from "react";
import Modal from "react-modal";
import { useModalContext } from "../context/modal/modalContext";
import styled from "styled-components";
import { ModalActionType } from "../context/modal/modalReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Group, Input, InputGroup } from "../common/components/atomic";
import { Dollar } from "../common/components/atomic";
import { useAppContext } from "../context/app/appContext";
import { useMemo } from "react";
import { AppActionType } from "../context/app/appReducer";
import ReactTooltip from "react-tooltip";
import {
  estimateFee,
  getLiquidityDelta,
  getLiquidityFromTick,
  getTickFromPrice,
  getTokensAmountFromDepositAmountUSD,
} from "../utils/uniswapv3/math";
import AdjustButton from "../common/components/AdjustButton";

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
  max-height: 80vh;
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

  &.recommend {
    border: 1px solid rgba(37, 175, 96, 0.75);
    box-shadow: 0px 0px 5px 0px rgba(37, 175, 96, 0.75);
    -webkit-box-shadow: 0px 0px 5px 0px rgba(37, 175, 96, 0.75);
    -moz-box-shadow: 0px 0px 5px 0px rgba(37, 175, 96, 0.75);
  }

  & > span.badge {
    position: absolute;
    font-size: 0.6rem;
    border-radius: 5px;
    padding: 1px 5px;
    font-weight: 500;
    color: #bbb;
    border: 1px solid #bbb;
  }
  & > span.badge.recommend {
    color: rgba(37, 175, 96, 1);
    border: 1px solid rgba(37, 175, 96, 0.75);
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
const PriceContainer = styled.div`
  display: grid;
  grid-gap: 7px;
  grid-template-columns: repeat(2, 1fr);
`;
export const PriceInputGroup = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.175);
  padding: 6px 8px;
  border-radius: 12px;
  position: relative;
  margin-bottom: 2px;
  margin-top: 2px;

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

  const initialPrice: number[] = [
    state.token0PriceChart?.currentPriceUSD || 0,
    state.token1PriceChart?.currentPriceUSD || 0,
  ];
  const currentPrice = state.currentPrice || initialPrice;
  const futurePrice = state.futurePrice || initialPrice;

  const calculateTokensAmount = (pricesUSD: number[]) => {
    const P = pricesUSD[1] / pricesUSD[0];
    let Pl = state.priceRangeValue[0];
    let Pu = state.priceRangeValue[1];
    const depositAmountUSD = state.depositAmountValue;

    if (state.isFullRange && state.poolTicks) {
      const firstTick = state.poolTicks[0];
      const lastTick = state.poolTicks[state.poolTicks.length - 1];
      Pl = Number(firstTick.price0);
      Pu = Number(lastTick.price0);
    }

    const { amount0, amount1, liquidityDelta } =
      getTokensAmountFromDepositAmountUSD(
        P,
        Pl,
        Pu,
        pricesUSD[1],
        pricesUSD[0],
        depositAmountUSD
      );

    return { price: P, amount0, amount1, liquidityDelta };
  };

  const current = calculateTokensAmount(currentPrice);
  // Calculate future price based on liquidityDelta
  const liquidityDelta = current.liquidityDelta;
  const future = (() => {
    let P = futurePrice[1] / futurePrice[0];
    let Pl = state.priceRangeValue[0];
    let Pu = state.priceRangeValue[1];

    if (P < Pl) P = Pl;
    if (P > Pu) P = Pu;

    let deltaY = liquidityDelta * (Math.sqrt(P) - Math.sqrt(Pl));
    if (deltaY * futurePrice[0] < 0) deltaY = 0;
    if (P < Pl) deltaY = 0;

    let deltaX = liquidityDelta * (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu));
    if (deltaX * futurePrice[1] < 0) deltaX = 0;

    return { price: P, amount0: deltaX, amount1: deltaY };
  })();

  const futurePrice0Percentage =
    (100 * (futurePrice[0] - currentPrice[0])) / currentPrice[0];
  const futurePrice1Percentage =
    (100 * (futurePrice[1] - currentPrice[1])) / currentPrice[1];

  // Strategy A
  const valueUSDToken0A = current.amount1 * futurePrice[0];
  const valueUSDToken1A = current.amount0 * futurePrice[1];
  const totalValueA = valueUSDToken0A + valueUSDToken1A;
  const percentageA =
    (100 * (totalValueA - state.depositAmountValue)) / state.depositAmountValue;

  // Strategy B
  const token0AmountB = future.amount1;
  const token1AmountB = future.amount0;
  const valueUSDToken0B = token0AmountB * futurePrice[0];
  const valueUSDToken1B = token1AmountB * futurePrice[1];

  const P = current.price;
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

  const { amount0, amount1 } = getTokensAmountFromDepositAmountUSD(
    P,
    Pl,
    Pu,
    priceUSDX,
    priceUSDY,
    depositAmountUSD
  );

  const deltaL = getLiquidityDelta(
    P,
    Pl,
    Pu,
    amount0,
    amount1,
    Number(state.token0?.decimals || 18),
    Number(state.token1?.decimals || 18)
  );

  let currentTick = getTickFromPrice(
    P,
    state.token0?.decimals || "18",
    state.token1?.decimals || "18"
  );

  if (state.isPairToggled) currentTick = -currentTick;

  const L = useMemo(
    () => getLiquidityFromTick(state.poolTicks || [], currentTick),
    [state.poolTicks, currentTick]
  );
  const volume24H = state.volume24H;
  const feeTier = state.pool?.feeTier || "";
  const estimatedFee =
    P >= Pl && P <= Pu ? estimateFee(deltaL, L, volume24H, feeTier) : 0;
  const estimatedYield = estimatedFee * state.daysInPosition;
  const yieldPercentage = (100 * estimatedYield) / state.depositAmountValue;

  const totalValueB = valueUSDToken0B + valueUSDToken1B + estimatedYield;
  const percentageB =
    (100 * (totalValueB - state.depositAmountValue)) / state.depositAmountValue;

  // Summary
  const IL = Math.abs(totalValueA - (valueUSDToken0B + valueUSDToken1B));
  const ILPercentage = Math.abs((100 * IL) / totalValueA);

  const PnL = totalValueB - totalValueA;
  const PnLPercentage = (100 * PnL) / totalValueA;

  const minDaysToProfit = IL / estimatedFee;

  return (
    <>
      <Modal
        style={ModalStyle}
        isOpen={modalContext.state.isImpermanentLossModalOpen}
        contentLabel="Impermanent Loss Calculator"
        ariaHideApp={false}
      >
        <>
          <ReactTooltip id="il" delayShow={150} />
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
              <Strategy
                className={
                  Number(totalValueA.toFixed(2)) >
                  Number(totalValueB.toFixed(2))
                    ? "recommend"
                    : ""
                }
              >
                <span
                  className={`badge ${
                    Number(totalValueA.toFixed(2)) >
                    Number(totalValueB.toFixed(2))
                      ? "recommend"
                      : ""
                  }`}
                >
                  Strategy A: HODL
                </span>
                <span className="value">
                  <span className="p">
                    {percentageA >= 0 ? "+" : ""}
                    {percentageA.toFixed(2)}%
                  </span>
                  <Dollar style={{ fontSize: "1.5rem" }}>$</Dollar>
                  {totalValueA.toFixed(2)}
                </span>
                <Table className="adjust-padding-right">
                  <div>
                    <Token
                      data-for="il"
                      data-place="right"
                      data-html={true}
                      data-tip={`The token amount is calculated based on lower/upper tick and current price; where<br>Lower tick = ${
                        state.isFullRange ? "0" : Pl.toFixed(5)
                      } ${state.token0?.symbol}/${
                        state.token1?.symbol
                      }<br>Upper tick = ${
                        state.isFullRange ? "∞" : Pu.toFixed(5)
                      } ${state.token0?.symbol}/${
                        state.token1?.symbol
                      }<br>Current price = ${current.price.toFixed(5)}${
                        state.token0?.symbol
                      }/${state.token1?.symbol}`}
                    >
                      <img
                        alt={state.token0?.name}
                        src={state.token0?.logoURI}
                      />{" "}
                      <span>{state.token0?.symbol}</span>
                    </Token>
                    <div>{current.amount1.toFixed(5)}</div>
                    <div>${valueUSDToken0A.toFixed(2)}</div>
                  </div>
                  <div>
                    <Token
                      data-for="il"
                      data-place="right"
                      data-html={true}
                      data-tip={`The token amount is calculated based on lower/upper tick and current price; where<br>Lower tick = ${
                        state.isFullRange ? "0" : Pl.toFixed(5)
                      } ${state.token0?.symbol}/${
                        state.token1?.symbol
                      }<br>Upper tick = ${
                        state.isFullRange ? "∞" : Pu.toFixed(5)
                      } ${state.token0?.symbol}/${
                        state.token1?.symbol
                      }<br>Current price = ${current.price.toFixed(5)}${
                        state.token0?.symbol
                      }/${state.token1?.symbol}`}
                    >
                      <img
                        alt={state.token1?.name}
                        src={state.token1?.logoURI}
                      />{" "}
                      <span>{state.token1?.symbol}</span>
                    </Token>
                    <div>{current.amount0.toFixed(5)}</div>
                    <div>${valueUSDToken1A.toFixed(2)}</div>
                  </div>
                </Table>
              </Strategy>

              <Strategy
                className={
                  Number(totalValueB.toFixed(2)) >
                  Number(totalValueA.toFixed(2))
                    ? "recommend"
                    : ""
                }
              >
                <span
                  className={`badge ${
                    Number(totalValueB.toFixed(2)) >
                    Number(totalValueA.toFixed(2))
                      ? "recommend"
                      : ""
                  }`}
                >
                  Strategy B: Uniswap V3
                </span>
                <span className="value">
                  <span className="p">
                    {percentageB >= 0 ? "+" : ""}
                    {percentageB.toFixed(2)}%
                  </span>
                  <Dollar style={{ fontSize: "1.5rem" }}>$</Dollar>
                  {totalValueB.toFixed(2)}
                </span>
                <Table className="adjust-padding-right">
                  <div>
                    <Token
                      data-for="il"
                      data-place="right"
                      data-html={true}
                      data-tip={`The token amount is calculated based on lower/upper tick and future price; where<br>Lower tick = ${
                        state.isFullRange ? "0" : Pl.toFixed(5)
                      } ${state.token0?.symbol}/${
                        state.token1?.symbol
                      }<br>Upper tick = ${
                        state.isFullRange ? "∞" : Pu.toFixed(5)
                      } ${state.token0?.symbol}/${
                        state.token1?.symbol
                      }<br>Future price = ${future.price.toFixed(5)}${
                        state.token0?.symbol
                      }/${state.token1?.symbol}`}
                    >
                      <img
                        alt={state.token0?.name}
                        src={state.token0?.logoURI}
                      />{" "}
                      <span>{state.token0?.symbol}</span>
                    </Token>
                    <div>{token0AmountB.toFixed(5)}</div>
                    <div>${valueUSDToken0B.toFixed(2)}</div>
                  </div>
                  <div>
                    <Token
                      data-for="il"
                      data-place="right"
                      data-html={true}
                      data-tip={`The token amount is calculated based on lower/upper tick and future price; where<br>Lower tick = ${
                        state.isFullRange ? "0" : Pl.toFixed(5)
                      } ${state.token0?.symbol}/${
                        state.token1?.symbol
                      }<br>Upper tick = ${
                        state.isFullRange ? "∞" : Pu.toFixed(5)
                      } ${state.token0?.symbol}/${
                        state.token1?.symbol
                      }<br>Future price = ${future.price.toFixed(5)}${
                        state.token0?.symbol
                      }/${state.token1?.symbol}`}
                    >
                      <img
                        alt={state.token1?.name}
                        src={state.token1?.logoURI}
                      />{" "}
                      <span>{state.token1?.symbol}</span>
                    </Token>
                    <div>{token1AmountB.toFixed(5)}</div>
                    <div>${valueUSDToken1B.toFixed(2)}</div>
                  </div>
                  <div>
                    <div
                      data-for="il"
                      data-place="right"
                      data-html={true}
                      data-tip={`LP Yield = Daily Estimated Fee x Days Of Active Position; where<br>Daily Estimated Fee = $${estimatedFee.toFixed(
                        2
                      )}/d<br>Days Of Active Position = ${
                        state.daysInPosition
                      }<br><br>P.S. Daily Estimated Fee is calculated based on lower/upper ticks, current price, and deposit amount.`}
                    >
                      LP Yield ({state.daysInPosition.toFixed(0)}d)
                    </div>
                    <div>{yieldPercentage.toFixed(2)}%</div>
                    <div>${estimatedYield.toFixed(2)}</div>
                  </div>
                </Table>
              </Strategy>
            </StrategyContainer>

            <Table style={{ marginTop: 10, color: "white" }}>
              <div>
                <div
                  data-for="il"
                  data-place="right"
                  data-html={true}
                  data-tip={`Impermanent Loss (IL) <br><br> IL = A - (Token0's B + Token1's B); where<br>A = $${totalValueA.toFixed(
                    2
                  )}<br>Token0's B = $${valueUSDToken0B.toFixed(
                    2
                  )}<br>Token1's B = $${valueUSDToken1B.toFixed(2)}`}
                >
                  Impermanent Loss
                </div>
                <div>-${IL.toFixed(2)}</div>
                <div>-{ILPercentage.toFixed(2)}%</div>
              </div>
              <div>
                <div
                  data-for="il"
                  data-place="right"
                  data-html={true}
                  data-tip={`Profit and loss (PnL) comparing between strategy A and B <br><br> PnL = B - A; where<br>
                  B = $${totalValueB.toFixed(2)}<br>A = $${totalValueA.toFixed(
                    2
                  )}`}
                >
                  PnL ({state.daysInPosition.toFixed(0)}d)
                </div>
                <div>
                  {PnL >= 0 ? "+" : "-"}${Math.abs(PnL).toFixed(2)}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    color:
                      Number(PnLPercentage.toFixed(2)) > 0
                        ? "#25af60"
                        : Number(PnLPercentage.toFixed(2)) < 0
                        ? "#ff5aaa"
                        : "",
                  }}
                >
                  {PnLPercentage >= 0 ? "+" : ""}
                  {PnLPercentage.toFixed(2)}%
                </div>
              </div>
            </Table>

            <Group style={{ marginTop: 10 }}>
              <PriceContainer>
                <PriceInputGroup>
                  <span
                    className="heading"
                    data-for="il"
                    data-place="right"
                    data-tip={`${Number(current.price.toFixed(7))} ${
                      state.token0?.symbol
                    }/${state.token1?.symbol}`}
                  >
                    Current Price
                  </span>
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
                </PriceInputGroup>

                <PriceInputGroup>
                  <span
                    className="heading"
                    data-for="il"
                    data-place="bottom"
                    data-tip={`${Number(future.price.toFixed(7))} ${
                      state.token0?.symbol
                    }/${state.token1?.symbol}`}
                  >
                    Future Price
                  </span>

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
                </PriceInputGroup>
              </PriceContainer>

              <InputGroup style={{ marginTop: 7, marginBottom: 2 }}>
                <AdjustButton
                  onDecrease={() => {
                    dispatch({
                      type: AppActionType.SET_DAYS_IN_POSITION,
                      payload: Math.max(state.daysInPosition - 1, 0),
                    });
                  }}
                  onIncrease={() => {
                    dispatch({
                      type: AppActionType.SET_DAYS_IN_POSITION,
                      payload: state.daysInPosition + 1,
                    });
                  }}
                />
                <span
                  style={{ color: "#bbb", fontWeight: "bold" }}
                  data-for="il"
                  data-place="right"
                  data-tip="Expected number of days that your position will be accrued fees."
                >
                  Days of Active Position
                </span>
                <Input
                  value={state.daysInPosition}
                  type="number"
                  placeholder="0.0"
                  onChange={(e) => {
                    let value = Number(e.target.value);
                    if (value < 0) value = 0;

                    dispatch({
                      type: AppActionType.SET_DAYS_IN_POSITION,
                      payload: value,
                    });
                  }}
                />
                <span>
                  Your position need to be active ≥ {minDaysToProfit.toFixed(2)}
                  d to cover IL
                </span>
              </InputGroup>
            </Group>
          </Container>
        </>
      </Modal>
    </>
  );
};

export default ImpermanentLossModal;

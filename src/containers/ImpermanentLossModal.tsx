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

const ImpermanentLossModal = () => {
  const modalContext = useModalContext();
  const { state, dispatch } = useAppContext();
  const [futurePriceSlider, setFuturePriceSlider] = useState(0);

  const futurePrice = state.futurePrice || state.priceAssumptionValue || 0;

  // TODO: Refactor
  const prices = divideArray(
    (state.token1PriceChart?.prices || []).map((p: Price) => p.value),
    (state.token0PriceChart?.prices || []).map((p: Price) => p.value)
  );
  const currentPrice = Number(state.pool?.token0Price || NaN);
  let _min = findMin(prices);
  let _max = findMax(prices);
  if (state.token0PriceChart === null || state.token1PriceChart === null) {
    _min = currentPrice - currentPrice * 0.3;
    _max = currentPrice + currentPrice * 0.3;
  }
  const margin = _max - _min;
  const min = Math.max(0, _min - margin);
  const max = _max + margin;
  const btnStep = ((max - min) * 2) / 100; // 2%
  const step = 0.000001;

  useEffect(() => {
    setFuturePriceSlider((100 * (futurePrice - min)) / (max - min));
  }, [futurePrice, min, max]);

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
                  // onClick={() => {
                  //   dispatch({
                  //     type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
                  //     payload: state.priceAssumptionValue - btnStep,
                  //   });
                  // }}
                >
                  <span>-</span>
                </div>
                <div
                  className="btn btn-right"
                  // onClick={() => {
                  //   dispatch({
                  //     type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
                  //     payload: state.priceAssumptionValue + btnStep,
                  //   });
                  // }}
                >
                  <span>+</span>
                </div>
                <span style={{ fontWeight: "bold" }}>
                  Number of Days in the Position
                </span>
                <Input
                  value={12.25}
                  type="number"
                  placeholder="0.0"
                  // onChange={(e) => {
                  //   let value = Number(e.target.value);

                  //   dispatch({
                  //     type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
                  //     payload: value,
                  //   });
                  // }}
                />
                <span>You need to be in the position ≥ 12.25d to profit</span>
              </InputGroup>

              <InputGroup style={{ marginTop: 8 }}>
                <div
                  className="btn btn-left"
                  onClick={() => {
                    dispatch({
                      type: AppActionType.SET_FUTURE_PRICE,
                      payload: futurePrice - btnStep,
                    });
                  }}
                >
                  <span>-</span>
                </div>
                <div
                  className="btn btn-right"
                  onClick={() => {
                    dispatch({
                      type: AppActionType.SET_FUTURE_PRICE,
                      payload: futurePrice + btnStep,
                    });
                  }}
                >
                  <span>+</span>
                </div>
                <span style={{ fontWeight: "bold" }}>Future Price (+10%)</span>
                <Input
                  value={futurePrice}
                  type="number"
                  placeholder="0.0"
                  onChange={(e) => {
                    let value = Number(e.target.value);

                    dispatch({
                      type: AppActionType.SET_FUTURE_PRICE,
                      payload: value,
                    });
                  }}
                />
                <span>ETH per USDT</span>
              </InputGroup>
              <Slider
                thumbClassName="thumb-yellow"
                value={futurePriceSlider}
                min={0}
                max={100}
                step={step}
                onChange={(value, _) => {
                  setFuturePriceSlider(value);

                  dispatch({
                    type: AppActionType.SET_FUTURE_PRICE,
                    payload: min + ((max - min) * value) / 100,
                  });
                }}
              />
            </Group>
          </Container>
        </>
      </Modal>
    </>
  );
};

export default ImpermanentLossModal;

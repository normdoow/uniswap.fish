import Modal from "react-modal";
import { useModalContext } from "../context/modal/modalContext";
import styled from "styled-components";
import { ModalActionType } from "../context/modal/modalReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Group, Input, InputGroup } from "../common/input";
import Slider from "./setting/Slider";
import { Dollar, Table } from "../common/components";
import { useAppContext } from "../context/app/appContext";

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
  & > div {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 8px;
  }
  & > div:nth-child(1) {
    margin-bottom: 10px;
  }
`;
const Strategy = styled.div`
  position: relative;
  & > span.badge {
    position: absolute;
    color: white;
    font-size: 0.8rem;
    color: #4190ff;
    background: rgba(20, 112, 241, 0.175);
    border-radius: 5px;
    padding: 1px 5px;
    font-weight: bold;
  }
  & > span.value {
    color: white;
    font-size: 1.4rem;
    display: flex;
    justify-content: right;
    margin-top: -5px;

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

const ImpermanentLossModal = () => {
  const modalContext = useModalContext();
  const { state, dispatch } = useAppContext();

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
                <span className="badge">Strategy A: HODL</span>
                <span className="value">
                  <span className="p">+25%</span>
                  <Dollar style={{ fontSize: "1.5rem" }}>$</Dollar>
                  10025.14
                </span>
                <Table>
                  <Token>
                    <img alt={state.token0?.name} src={state.token0?.logoURI} />{" "}
                    <span>{state.token0?.symbol}</span>
                  </Token>
                  <div>1000</div>
                  <div>$1000</div>
                </Table>
                <Table>
                  <Token>
                    <img alt={state.token1?.name} src={state.token1?.logoURI} />{" "}
                    <span>{state.token1?.symbol}</span>
                  </Token>
                  <div>1000</div>
                  <div>$1000</div>
                </Table>
              </Strategy>

              <Strategy>
                <span className="badge">Strategy B: UNIV3</span>
                <span className="value">
                  <span className="p">+25%</span>
                  <Dollar style={{ fontSize: "1.5rem" }}>$</Dollar>
                  10025.14
                </span>
                <Table>
                  <Token>
                    <img alt={state.token0?.name} src={state.token0?.logoURI} />{" "}
                    <span>{state.token0?.symbol}</span>
                  </Token>
                  <div>1000</div>
                  <div>$1000</div>
                </Table>
                <Table>
                  <Token>
                    <img alt={state.token1?.name} src={state.token1?.logoURI} />{" "}
                    <span>{state.token1?.symbol}</span>
                  </Token>
                  <div>1000</div>
                  <div>$1000</div>
                </Table>
                <Table>
                  <div>LP Yield (12.25d)</div>
                  <div>5.25%</div>
                  <div>$1000</div>
                </Table>
              </Strategy>
            </StrategyContainer>

            <Table>
              <div>IL</div>
              <div>-5000 USDT</div>
              <div>-10%</div>
            </Table>
            <Table>
              <div>PnL</div>
              <div>+259 USDT</div>
              <div>+10%</div>
            </Table>

            <Group>
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
                <span>Number of Days in the Position</span>
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
                <span>You need to have at least 12.25d to stay profit</span>
              </InputGroup>

              <InputGroup style={{ marginTop: 8 }}>
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

                <span>Future Price (+10%)</span>
                <Input
                  // value={state.priceAssumptionValue || 0}
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
                <span>ETH per USDT</span>
              </InputGroup>
              <Slider
                thumbClassName="thumb-yellow"
                // value={activePriceAssumptionSlider}
                value={10}
                min={0}
                max={100}
                step={100}
                onChange={(value, _) => {
                  // setActivePriceAssumptionSlider(value);
                  // dispatch({
                  //   type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
                  //   payload: min + ((max - min) * value) / 100,
                  // });
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

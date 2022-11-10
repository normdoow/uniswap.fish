import Modal from "react-modal";
import { useModalContext } from "../context/modal/modalContext";
import styled from "styled-components";
import { ModalActionType } from "../context/modal/modalReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Group, Input, InputGroup } from "../common/input";
import Slider from "./setting/Slider";
import { Table } from "../common/components";

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
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    height: 75px;
  }
  & > div:nth-child(1) {
    margin-bottom: 10px;
  }
`;

const ImpermanentLossModal = () => {
  const modalContext = useModalContext();

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
              <div>HOLD</div>
              <div>LP</div>
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

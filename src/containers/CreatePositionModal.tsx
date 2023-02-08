import React from "react";
import Modal from "react-modal";
import { useModalContext } from "../context/modal/modalContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ModalActionType } from "../context/modal/modalReducer";
import ReactTooltip from "react-tooltip";

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

const DepositAmountSection = () => {
  return (
    <>
      <span>Deposit Amount</span>
    </>
  );
};

const CreatePositionModal = () => {
  const { state, dispatch } = useModalContext();

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
            <DepositAmountSection />
          </Container>
        </>
      </Modal>
    </>
  );
};

export default CreatePositionModal;

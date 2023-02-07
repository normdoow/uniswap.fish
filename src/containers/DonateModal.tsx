import Modal from "react-modal";
import { useModalContext } from "../context/modal/modalContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ModalActionType } from "../context/modal/modalReducer";

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
  width: 470px;
  padding: 15px;
`;
const Header = styled.h1`
  color: white;
  margin: 0;
  font-weight: bold;
  font-size: 1.2rem;
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
    font-size: 1.2rem;
  }
  & span:nth-child(2) {
    cursor: pointer;
    margin-right: 7px;
  }
`;

const Content = styled.div`
  color: #ccc;

  & a {
    color: rgb(30, 161, 241);
    text-decoration: none;
    font-weight: 600;
  }
`;
const DonationBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  padding-top: 3px;

  & > span {
    font-weight: bold;
    font-size: 0.8rem;
  }
  & > div {
    padding: 3px 7px;
    margin-top: 5px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5rem;
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    & > div {
      cursor: pointer;
      margin-right: 5px;
    }
  }
`;

const DonateModal = () => {
  const { state, dispatch } = useModalContext();

  return (
    <>
      <Modal
        style={ModalStyle}
        isOpen={state.isDonateModalOpen}
        contentLabel="DONATE"
        ariaHideApp={false}
      >
        <>
          <Header>
            <span>💰 DONATE</span>
            <span
              onClick={() => {
                dispatch({
                  type: ModalActionType.SET_DONATE_MODAL_STATE,
                  payload: false,
                });
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </Header>
          <Container>
            <Content>
              <p>
                Hi! 🖐 my name is{" "}
                <a href="https://twitter.com/chunrapeepat" target="_blank">
                  Chun
                </a>
                , 22 y/o software developer, indie maker. It's been 2 weeks now
                since I getting to learn Blockchain, Ethereum (and of course
                Uniswap 🦄!) asides from my full-time job and this was the first
                project that I've built to learn more about Uniswap after using
                it for a while.
              </p>
              <p>
                So!, If you love this project (and want to see a lot more
                projects that I've planned to build in the near future), feel
                free to donate many{" "}
                <span style={{ fontWeight: 600, color: "rgb(134, 142, 173)" }}>
                  ETH
                </span>{" "}
                or{" "}
                <span style={{ fontWeight: 600, color: "rgb(247, 8, 129)" }}>
                  UNI
                </span>{" "}
                you want. your donation will go to my learning and investment
                budgets which will help me a lot to make this become career 😎
              </p>
              <DonationBox>
                <span>ETHEREUM ADDRESS</span>
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "0x79A375feFbF90878502eADBA4A89697896B60c4d"
                    );
                  }}
                >
                  <span>0x79A375feFbF90878502eADBA4A89697896B60c4d</span>
                  <div>
                    <FontAwesomeIcon icon={faCopy} />
                  </div>
                </div>
              </DonationBox>
              <p>Thanks and happy Uniswapping 🦄!</p>
            </Content>
          </Container>
        </>
      </Modal>
    </>
  );
};

export default DonateModal;

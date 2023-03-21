import Modal from "react-modal";
import { useModalContext } from "../context/modal/modalContext";
import styled from "styled-components";
import { ModalActionType } from "../context/modal/modalReducer";
import { PrimaryBlockButton } from "../common/components/atomic";

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

const Content = styled.div`
  color: #ccc;

  & img {
    width: 100%;
    border-radius: 7px;
  }

  & a {
    color: rgb(30, 161, 241);
    text-decoration: none;
    font-weight: 600;
  }
  & a:hover {
    text-decoration: underline;
  }
`;

const ImportantMessageModal = () => {
  const { state, dispatch } = useModalContext();

  const understand = () => {
    localStorage.setItem("metamask-phishing-detection", "OK");
    dispatch({
      type: ModalActionType.SET_ANNOUCEMENT_MODAL_STATE,
      payload: false,
    });
  };

  return (
    <>
      <Modal
        style={ModalStyle}
        isOpen={state.isImportantMessageModalOpen}
        contentLabel="Important Annoucement"
        ariaHideApp={false}
      >
        <>
          <Header>
            <span>🚨 Important Message</span>
          </Header>
          <Container>
            <Content>
              <img src="/metamask-phishing-detection.png"></img>
              <p>
                In the past few days, some of you might be got this
                scary-looking warning message from MetaMask, which was caused by{" "}
                <a
                  href="https://github.com/MetaMask/eth-phishing-detect/pull/8390#issuecomment-1243298906"
                  target="_blank"
                >
                  an incorrectly flagged
                </a>{" "}
                as a scam on the MetaMask's Phishing Detector.
              </p>
              <p>
                I want to say that{" "}
                <a
                  href="https://github.com/MetaMask/eth-phishing-detect/pull/8416#pullrequestreview-1103729295"
                  target="_blank"
                >
                  the problem has now been resolved
                </a>{" "}
                and we will keep maintaining and developing the project while{" "}
                <a
                  href="https://github.com/chunrapeepat/uniswap.fish"
                  target="_blank"
                >
                  making everything open-source
                </a>{" "}
                to ensure that the users{" "}
                <b style={{ color: "#59eb4f" }}>feel as safe as possible </b>
                to use our website.
              </p>
              <p>
                Lastly, thanks to everyone who still uses my project and
                supports me even though we've run into an unexpectedly hard
                situation;{" "}
                <b style={{ color: "#f76ac0" }}>Really appreciate it 💖</b>
              </p>
              <PrimaryBlockButton
                style={{ marginTop: 25 }}
                onClick={understand}
              >
                I understand, take me to the site!
              </PrimaryBlockButton>
            </Content>
          </Container>
        </>
      </Modal>
    </>
  );
};

export default ImportantMessageModal;

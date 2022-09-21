import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { DangerButton } from "../common/buttons";
import { useModalContext } from "../context/modal/modalContext";
import { ModalActionType } from "../context/modal/modalReducer";

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgb(0, 0, 0, 0.9);
  position: absolute;
  width: 100vw;
  top: 0;
  z-index: 9999;
`;

const Logo = styled.h1`
  color: white;
  margin: 0;
  font-weight: bold;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;

  & > span {
    font-size: 1.4rem;
    margin-right: 7px;
  }
`;

const Menubar = styled.a`
  display: flex;
  align-items: center;

  & a {
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.2rem;
    margin-right: 15px;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
`;
const Gitcoin = styled.div`
  position: relative;

  & p {
    font-size: 0.7em;
    color: white;
    margin: 0;
    position: absolute;
    width: 250px;
    right: 0;
    margin-top: 8px;
  }
`;

const Navbar = () => {
  const { dispatch } = useModalContext();

  return (
    <NavbarContainer>
      <Logo>
        <span>🦄</span> UniswapCalculator
      </Logo>
      <Menubar>
        <a
          href="https://twitter.com/chunza2542"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a
          href="https://github.com/chunza2542/uniswapv3-calculator"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a href="mailto:hello@thechun.dev">
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
        <a
          href="https://gitcoin.co/grants/4203/uniswap-calculator-v3"
          target="_blank"
        >
          <Gitcoin>
            <DangerButton
            // onClick={() => {
            //   dispatch({
            //     type: ModalActionType.SET_DONATE_MODAL_STATE,
            //     payload: true,
            //   });
            // }}
            >
              <span>Donate</span>
            </DangerButton>
            <p>🔥 Support our project on Gitcoin GR15!</p>
          </Gitcoin>
        </a>
      </Menubar>
    </NavbarContainer>
  );
};

export default Navbar;

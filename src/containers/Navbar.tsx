import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { DangerButton } from "../common/buttons";

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgb(0, 0, 0, 0.9);
  position: fixed;
  width: 100vw;
  top: 0;
  z-index: 9999;
`;

const Logo = styled.h1`
  color: white;
  margin: 0;
  font-weight: bold;
  font-size: 1.2rem;
  color: #ddd;
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
    color: #888;
    font-size: 1.2rem;
    margin-right: 15px;

    &:hover {
      color: #bbb;
    }
  }
`;

const Navbar = () => {
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
        {/* TODO: Implement Modal */}
        <DangerButton>Donate</DangerButton>
      </Menubar>
    </NavbarContainer>
  );
};

export default Navbar;

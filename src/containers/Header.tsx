import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgb(0, 0, 0, 0.5);
  position: fixed;
  width: 100vw;
  top: 0;
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

const DonateButton = styled.button`
  background: linear-gradient(
    150deg,
    rgb(247, 2, 119, 0.3),
    rgb(247, 2, 119, 0.7)
  );
  border: 0;
  color: #ccc;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 12px;
  padding: 6px 8px;
  cursor: pointer;

  &:hover {
    background: linear-gradient(
      150deg,
      rgb(247, 2, 119, 0.35),
      rgb(247, 2, 119, 0.9)
    );
    color: white;
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

const Header = () => {
  return (
    <HeaderContainer>
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
          href="https://github.com/chunza2542/uniswapcalculator"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a href="mailto:hello@thechun.dev">
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
        {/* TODO: Implement Modal */}
        <DonateButton>Donate</DonateButton>
      </Menubar>
    </HeaderContainer>
  );
};

export default Header;

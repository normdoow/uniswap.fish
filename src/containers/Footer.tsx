import React from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const FooterContainer = styled.div`
  padding: 50px 15px;
  text-align: center;
  color: #bbb;
  font-size: 0.8rem;

  & svg {
    color: rgb(247, 2, 119);
  }

  & a {
    color: rgb(30, 161, 241);
    font-weight: bold;
    text-decoration: none;
  }

  & > div:nth-child(2) {
    margin-top: 7px;

    & > a {
      color: #777;
      margin: 0 7px;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <div>
        Supported by{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://mirror.xyz/devi731.eth/Dy705L0V2MufftJ-x4zgAhfILw2yE18RY0lNsVN3mEA"
        >
          Uniswap Foundation
        </a>
        . Crafted with <FontAwesomeIcon icon={faHeart} /> by{" "}
        <a
          rel="noreferrer"
          href="https://twitter.com/chunrapeepat"
          target="_blank"
        >
          @chunrapeepat
        </a>
        , Happy Uniswapping 🦄!!
      </div>
      <div>
        <a
          href="https://github.com/chunza2542/uniswap.fish"
          rel="noreferrer"
          target="_blank"
        >
          How it works?
        </a>
        <a
          href="https://github.com/chunza2542/uniswap.fish"
          rel="noreferrer"
          target="_blank"
        >
          Source Code (Github)
        </a>
        <a href="mailto:hello@uniswap.fish">Contact: hello@uniswap.fish</a>
      </div>
    </FooterContainer>
  );
};

export default Footer;

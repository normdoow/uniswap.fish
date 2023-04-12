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
        Crafted with <FontAwesomeIcon icon={faHeart} /> by{" "}
        <a
          rel="noreferrer"
          href="https://twitter.com/chunrapeepat"
          target="_blank"
        >
          @chunrapeepat
        </a>
        , Happy Uniswapping 🦄!!
        <br />
        Supported by{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.uniswapfoundation.org"
        >
          Uniswap Foundation
        </a>
        . Powered by{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.coingecko.com/en/api"
        >
          Coingecko API
        </a>
        .
      </div>
      <div>
        <a
          href="https://github.com/chunrapeepat/uniswap.fish"
          rel="noreferrer"
          target="_blank"
        >
          How it works?
        </a>
        <a
          href="https://github.com/chunrapeepat/uniswap.fish"
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

import React from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const CreditContainer = styled.div`
  padding: 50px 15px;
  color: white;
  text-align: center;
  color: #999;
  font-size: 0.8rem;

  & svg {
    color: rgb(247, 2, 119);
  }

  & a {
    color: rgb(30, 161, 241);
    font-weight: bold;
    text-decoration: none;
  }
`;

const Credit = () => {
  return (
    <CreditContainer>
      Made with <FontAwesomeIcon icon={faHeart} /> by{" "}
      <a href="https://twitter.com/chunza2542" target="_blank">
        @chunza2542
      </a>
      , Happy Uniswapping 🦄!!
    </CreditContainer>
  );
};

export default Credit;

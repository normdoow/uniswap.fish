import React from "react";
import styled from "styled-components";
import { Heading } from "../../common/atomic";
import { V3Token } from "../../repos/uniswap";
import { getTokenLogoURL } from "../../utils/helper";

const Container = styled.div`
  width: 400px;
  padding: 15px;
`;
const SearchInput = styled.input`
  border: 0;
  outline: none;
  width: 100%;
  padding: 12px 12px;
  border-radius: 12px;
  font-size: 1rem;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.15);
  }
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
`;
const Scrollable = styled.div`
  height: 250px;
  overflow: scroll;
`;
const TokenItem = styled.div`
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  transition: 0.3s;
  padding: 5px 15px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  & > img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 15px;
  }

  & > div {
    & h5 {
      margin: 0;
      font-weight: normal;
      font-size: 1rem;
      color: white;
    }
    & span {
      font-size: 0.8rem;
      color: #999;
      display: block;
    }
  }
`;

interface SearchTokenPageProps {
  tokens: V3Token[];
}
const SearchTokenPage = ({ tokens }: SearchTokenPageProps) => {
  return (
    <>
      <Container>
        <Heading>Select a token</Heading>
        <SearchInput placeholder="Search token name" />
      </Container>
      <Divider />
      <Scrollable>
        {tokens.map((token) => {
          return (
            <TokenItem id={`${token.symbol}_${token.name}`}>
              <img src={getTokenLogoURL(token.id)} alt={token.name} />
              <div>
                <h5>{token.symbol}</h5>
                <span>{token.name}</span>
              </div>
            </TokenItem>
          );
        })}
      </Scrollable>
    </>
  );
};

export default SearchTokenPage;

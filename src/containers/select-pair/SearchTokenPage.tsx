import React, { useState } from "react";
import styled from "styled-components";
import { Heading } from "../../common/atomic";
import { V3Token } from "../../repos/uniswap";
import ReactLoading from "react-loading";
import { useEffect } from "react";
import Fuse from "fuse.js";

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
const LoadingContainer = styled.div`
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
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

const MAX_NUMBER_PER_PAGE = 100;
interface SearchTokenPageProps {
  tokens: V3Token[];
}
const SearchTokenPage = ({ tokens }: SearchTokenPageProps) => {
  const [filteredTokens, setFilteredTokens] = useState<V3Token[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setFilteredTokens(tokens.slice(0, MAX_NUMBER_PER_PAGE));
  }, [tokens]);

  const handleSearch = (value: string) => {
    if (value === "") {
      setFilteredTokens(tokens.slice(0, MAX_NUMBER_PER_PAGE));
      setIsLoading(false);
      return;
    }

    timeoutId && clearTimeout(timeoutId);
    setIsLoading(true);

    const _timeoutId = setTimeout(() => {
      const fuse = new Fuse(tokens, {
        includeScore: true,
        keys: ["id", "name", "symbol"],
      });

      setFilteredTokens(fuse.search(value).map((d) => d.item) as V3Token[]);

      timeoutId && clearTimeout(timeoutId);
      setIsLoading(false);
    }, 1000);

    setTimeoutId(_timeoutId);
  };

  return (
    <>
      <Container>
        <Heading>Select a token</Heading>
        <SearchInput
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search name or paste address"
        />
      </Container>
      <Divider />
      {(isLoading || tokens.length === 0) && (
        <LoadingContainer>
          <ReactLoading
            type="spin"
            color="rgba(34, 114, 229, 1)"
            height={50}
            width={50}
          />
        </LoadingContainer>
      )}
      {!isLoading && tokens.length > 0 && (
        <Scrollable>
          {filteredTokens.map((token) => {
            return (
              <TokenItem id={`${token.symbol}_${token.name}_${token.id}`}>
                <img src={token.logoURI} alt={token.name} />
                <div>
                  <h5>{token.symbol}</h5>
                  <span>{token.name}</span>
                </div>
              </TokenItem>
            );
          })}
        </Scrollable>
      )}
    </>
  );
};

export default SearchTokenPage;

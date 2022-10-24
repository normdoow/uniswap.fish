import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getToken } from "../../repos/uniswap";
import ReactLoading from "react-loading";
import Web3 from "web3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import { Token } from "../../common/interfaces/uniswap.interface";
import { getCurrentNetwork } from "../../common/network";

const Container = styled.div`
  width: 370px;
  padding: 15px;

  @media only screen and (max-width: 400px) {
    width: calc(100vw - 30px);
    padding: 10px;
  }
`;
const NotFound = styled.div`
  color: #777;
  font-size: 0.8rem;
  text-align: center;
  margin-top: 30px;
`;
const SearchInput = styled.input`
  border: 0;
  outline: none;
  width: 100%;
  padding: 12px 12px;
  border-radius: 9px;
  font-size: 1rem;
  color: white;
  background: rgba(255, 255, 255, 0.075);
  cursor: pointerk;
  transition: 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.125);
  }
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
`;
const Scrollable = styled.div`
  height: 300px;
  overflow: scroll;
`;
const LoadingContainer = styled.div`
  height: 300px;
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

  @media only screen and (max-width: 400px) {
    padding: 5px 10px;
  }

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
const TokenItemWrapper = styled.div`
  position: relative;

  & > button {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 35px;
    height: 35px;
    background: rgba(255, 255, 255, 0);
    border-radius: 50%;

    border: 0;
    color: #777;
    cursor: pointer;
    font-size: 1.075rem;

    &:hover {
      color: #999;
      background: rgba(255, 255, 255, 0.075);
    }
    &:active {
      color: #ccc;
      background: rgba(255, 255, 255, 0.125);
    }

    @media only screen and (max-width: 400px) {
      right: 10px;
    }
  }
`;

interface SearchTokenPageProps {
  tokens: Token[];
  selectToken: (token: Token) => void;
  refetchTokens: () => void;
}
const SearchTokenPage = ({
  tokens: _tokens,
  selectToken,
  refetchTokens,
}: SearchTokenPageProps) => {
  const [tokens, setTokens] = useState<Token[]>(_tokens);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTokenNotFound, setIsTokenNotFound] = useState<boolean>(false);
  const [filterCSSStyle, setFilterCSSStyle] = useState<string>(``);
  const [searchDataFilter, setSearchDataFilter] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    setTokens(_tokens);
  }, [_tokens]);

  useEffect(() => {
    setSearchDataFilter(
      tokens.map(
        (token) =>
          `${token.id.toLowerCase()} ${token.symbol.toLowerCase()} ${token.name.toLowerCase()}`
      )
    );
  }, [tokens]);

  const handleSearch = async (value: string) => {
    setIsTokenNotFound(false);
    setIsLoading(false);
    setSearchValue(value);

    value = value.trim().toLowerCase();
    if (!value) {
      setFilterCSSStyle(``);
    } else {
      setFilterCSSStyle(
        `.token-item:not([data-filter*="${value}"]) { display: none }`
      );

      const count = searchDataFilter.filter(
        (x) => x.indexOf(value) !== -1
      ).length;
      if (count > 0) return;

      if (Web3.utils.isAddress(value)) {
        setIsLoading(true);
        const token = await getToken(value);
        setIsLoading(false);

        if (!token) {
          setIsTokenNotFound(true);
          return;
        }

        setIsTokenNotFound(false);
        setTokens([...tokens, token]);

        // save token in localStorage for later use
        const key = `SearchTokenPage_${getCurrentNetwork().id}_tokens`;
        const items = localStorage.getItem(key);
        if (items === null) {
          localStorage.setItem(key, JSON.stringify([token]));
        } else {
          localStorage.setItem(
            key,
            JSON.stringify([...JSON.parse(items), token])
          );
        }
        refetchTokens();

        return;
      }

      setIsTokenNotFound(true);
    }
  };

  return (
    <>
      <style>{filterCSSStyle}</style>
      <ReactTooltip place="left" />
      <Container>
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
          {tokens.map((token) => {
            return (
              <TokenItemWrapper
                key={`${token.symbol}_${token.name}_${token.id}`}
                data-filter={`${token.id.toLowerCase()} ${token.symbol.toLowerCase()} ${token.name.toLowerCase()}`}
                className="token-item"
              >
                <TokenItem onClick={() => selectToken(token)}>
                  <img
                    src={token.logoURI}
                    alt={token.name}
                    onError={(e: any) => {
                      e.target.src =
                        "https://friconix.com/png/fi-cnsuxl-question-mark.png";
                    }}
                  />
                  <div>
                    <h5>
                      {token.symbol}
                      {/* DEBUG: {getCoingeckoToken(token.id) !== null
                      ? getCoingeckoToken(token.id)?.id
                      : "NOT"} */}
                    </h5>
                    <span>
                      {token.name.length >= 35
                        ? `${token.name.slice(0, 35)}...`
                        : token.name}
                    </span>
                  </div>
                </TokenItem>
                <button
                  data-tip="Copy token address"
                  onClick={() => {
                    navigator.clipboard.writeText(token.id);
                  }}
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </TokenItemWrapper>
            );
          })}
          {isTokenNotFound && (
            <NotFound>
              No results found.
              {!Web3.utils.isAddress(searchValue) && (
                <>
                  <br />
                  Try pasting the token address in the search bar.
                </>
              )}
            </NotFound>
          )}
        </Scrollable>
      )}
    </>
  );
};

export default SearchTokenPage;

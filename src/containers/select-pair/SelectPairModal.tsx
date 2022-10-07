import { useEffect } from "react";
import Modal from "react-modal";
import ReactLoading from "react-loading";
import { useModalContext } from "../../context/modal/modalContext";
import { Heading } from "../../common/atomic";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { PrimaryBlockButton } from "../../common/buttons";
import { useState } from "react";
import {
  getPoolFromPair,
  getPoolTicks,
  getTopTokenList,
  getVolumn24H,
  Pool,
  updateNetwork,
  V3Token,
} from "../../repos/uniswap";
import SearchTokenPage from "./SearchTokenPage";
import { useAppContext } from "../../context/app/appContext";
import { AppActionType } from "../../context/app/appReducer";
import { sortToken } from "../../utils/helper";
import { getPriceChart } from "../../repos/coingecko";
import { ModalActionType } from "../../context/modal/modalReducer";
import { Network, NETWORKS } from "../../common/types";

const ModalStyle = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.9)",
    zIndex: 99999,
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
  max-width: 370px;
  padding: 15px;

  @media only screen and (max-width: 400px) {
    padding: 10px;
  }
`;
const SelectNetworkContainer = styled.div`
  margin-bottom: 15px;
`;
const SelectPairContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  margin-bottom: 15px;
  grid-template-columns: repeat(2, 1fr);
`;
const TokenSelect = styled.div`
  color: white;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.1);
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  & > span {
    display: flex;
    align-items: center;

    & > img {
      width: 25px;
      height: 25px;
      margin-right: 10px;
      border-radius: 50%;
    }
  }
`;
const Tier = styled.div`
  border-radius: 12px;
  padding: 6px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);

  & h4 {
    color: #fff;
    margin: 0;
    font-size: 1rem;
  }

  & > span {
    font-size: 0.8rem;
    line-height: 1.2rem;
    margin-top: 5px;
    display: inline-block;
    color: #999;
  }

  & > div {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 3px 5px;
    color: #ccc;
    font-size: 0.8rem;
    margin-top: 7px;
    text-align: center;
  }
`;
const FeeTiersContainer = styled.div`
  display: grid;
  grid-gap: 7px;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 20px;
`;
const GoBack = styled.h1`
  color: white;
  margin: 0;
  font-weight: 500;
  display: flex;
  padding: 15px;
  justify-content: center;
  align-items: center;
  background: rgb(50, 50, 50);
  font-size: 1rem;

  @media only screen and (max-width: 400px) {
    padding: 15px 10px;
  }

  & > div {
    cursor: pointer;
    position: absolute;
    left: 15px;
  }
`;
const NetworkItem = styled.div`
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  transition: 0.3s;
  width: calc(370px - 10px * 2);
  margin: 10px;
  border: 1px solid #333;
  border-radius: 15px;
  padding: 10px 15px;
  position: relative;

  @media only screen and (max-width: 400px) {
    width: calc(100vw - 50px);
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

      & > span {
        position: absolute;
        right: 10px;
        top: 10px;
        background: #fd0000;
        color: white;
        font-size: 0.6rem;
        padding: 3px 5px;
        border-radius: 5px;
        font-weight: bold;
      }
    }
    & span {
      font-size: 0.8rem;
      color: #999;
      display: block;
    }
  }
`;
const Logo = styled.h1`
  color: white;
  margin: 0;
  font-weight: bold;
  font-size: 1.2rem;
  font-weight: 500;
  display: flex;
  padding: 15px;
  align-items: center;
  background: rgb(50, 50, 50);
  & > span {
    font-size: 1.4rem;
    margin-right: 7px;
  }

  @media only screen and (max-width: 400px) {
    padding: 15px 10px;
  }
`;
const FEE_TIER_STYLES = {
  DISABLE: {
    cursor: "not-allowed",
    background: "rgba(255, 255, 255, 0.1)",
  },
  ACTIVE: {
    border: "1px solid rgba(38, 109, 221, 1)",
    background: "rgba(38, 109, 221, 0.25)",
  },
};
const SelectPairModal = () => {
  const appContext = useAppContext();
  const modalContext = useModalContext();

  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(
    NETWORKS[0]
  );
  const [selectedTokens, setSelectedTokens] = useState<V3Token[] | null[]>([
    null,
    null,
  ]);
  const [showSelectNetworkPage, setShowSelectNetworkPage] =
    useState<boolean>(false);
  const [showSelectTokenPage, setShowSelectTokenPage] =
    useState<boolean>(false);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(
    null
  );

  const [pools, setPools] = useState<Pool[]>([]);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    fetchPools();
  }, [selectedTokens]);

  const isFormDisabled =
    isSubmitLoading ||
    !(selectedTokens[0] && selectedTokens[1] && selectedPool);

  const handleSubmit = async () => {
    if (
      isSubmitLoading ||
      !(selectedTokens[0] && selectedTokens[1] && selectedPool) ||
      !selectedNetwork
    ) {
      return;
    }
    setIsSubmitLoading(true);

    const [token0, token1] = sortToken(selectedTokens[0], selectedTokens[1]);
    const pool = selectedPool;

    const [poolTicks, token0PriceChart, token1PriceChart, volume24H] =
      await Promise.all([
        getPoolTicks(pool.id),
        getPriceChart(token0.id),
        getPriceChart(token1.id),
        getVolumn24H(pool.id),
      ]);

    appContext.dispatch({
      type: AppActionType.RESET_PAIR,
      payload: {
        network: selectedNetwork,
        pool,
        poolTicks,
        token0,
        token1,
        token0PriceChart,
        token1PriceChart,
        volume24H,
      },
    });

    setIsSubmitLoading(false);
    modalContext.dispatch({
      type: ModalActionType.SET_SELECT_PAIR_MODAL_STATE,
      payload: false,
    });
  };

  const fetchPools = async () => {
    if (!selectedTokens[0] || !selectedTokens[1]) return;

    setIsSubmitLoading(true);
    const pools = await getPoolFromPair(selectedTokens[0], selectedTokens[1]);
    setPools(pools);
    setIsSubmitLoading(false);

    if (pools.length === 0) {
      setSelectedPool(null);
      return;
    }

    let maxPool = pools[0];
    let maxLiquidity = Number(pools[0].liquidity);
    pools.forEach((pool) => {
      if (Number(pool.liquidity) > maxLiquidity) {
        maxPool = pool;
        maxLiquidity = Number(pool.liquidity);
      }
    });
    if (maxLiquidity !== 0) {
      setSelectedPool(maxPool);
    }
  };

  const getFeeTier = (feeTier: string) => {
    const pool = pools.find((pool) => pool.feeTier === feeTier);
    if (!pool) return null;
    if (+pool.liquidity === 0) return null;
    return pool;
  };

  const getFeeTierPercentage = (feeTier: string) => {
    const tier = getFeeTier(feeTier);
    if (tier === null) {
      return "Not Available";
    }
    const totalLiquidity = pools.reduce(
      (result, curr) => result + Number(curr.liquidity),
      0
    );
    if (totalLiquidity === 0) return "Not Available";
    return `${Math.round(
      (100 * Number(tier.liquidity)) / totalLiquidity
    )}% select`;
  };

  const getFeeTierStyle = (feeTier: string) => {
    if (getFeeTier(feeTier) === null) {
      return FEE_TIER_STYLES.DISABLE;
    }

    if (selectedPool?.feeTier === feeTier) {
      return FEE_TIER_STYLES.ACTIVE;
    }

    return {};
  };

  const fetchTokens = async () => {
    appContext.dispatch({
      type: AppActionType.RESET_TOKEN_LIST,
      payload: { tokenList: [] },
    });

    const tokenList = await getTopTokenList();
    appContext.dispatch({
      type: AppActionType.RESET_TOKEN_LIST,
      payload: { tokenList },
    });
  };

  const selectToken = (token: V3Token) => {
    const _selectedTokens = JSON.parse(JSON.stringify(selectedTokens));

    if (selectedTokenIndex !== null) {
      _selectedTokens[selectedTokenIndex] = token;
    }

    setSelectedTokens(_selectedTokens);
    setSelectedTokenIndex(null);
    setShowSelectTokenPage(false);
  };

  return (
    <>
      <Modal
        style={ModalStyle}
        isOpen={modalContext.state.isSelectPairModalOpen}
        contentLabel="Example Modal"
      >
        {showSelectNetworkPage && (
          <>
            <GoBack>
              <div
                onClick={() => {
                  setShowSelectNetworkPage(false);
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <span>Select Network</span>
            </GoBack>
            {NETWORKS.map((network, i) => {
              return (
                <NetworkItem
                  style={
                    network.disabled
                      ? {
                          cursor: "not-allowed",
                          background: "rgba(255, 255, 255, 0.1)",
                          opacity: "0.4",
                        }
                      : {}
                  }
                  onClick={() => {
                    if (!network.disabled) {
                      updateNetwork(network);
                      fetchTokens();

                      setSelectedNetwork(network);
                      setSelectedTokens([null, null]);
                      setShowSelectNetworkPage(false);
                      setPools([]);
                    }
                  }}
                  id={`${network.name}_${i}`}
                >
                  <img src={network.logoURI} alt={network.name} />
                  <div>
                    <h5>
                      {network.name} {network.isNew && <span>NEW</span>}
                    </h5>
                    <span>{network.desc}</span>
                  </div>
                </NetworkItem>
              );
            })}
          </>
        )}
        {showSelectTokenPage && (
          <>
            <GoBack>
              <div
                onClick={() => {
                  setShowSelectTokenPage(false);
                  setSelectedTokenIndex(null);
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <span>Select Token</span>
            </GoBack>
            <SearchTokenPage
              refetchTokens={() => {
                fetchTokens();
              }}
              selectToken={selectToken}
              tokens={appContext.state.tokenList}
            />
          </>
        )}
        {!showSelectTokenPage && !showSelectNetworkPage && (
          <>
            <Logo>
              <span>🦄</span> UniswapCalculator
            </Logo>
            <Container>
              <Heading>Select Network</Heading>
              <SelectNetworkContainer>
                <TokenSelect
                  onClick={() => {
                    if (!isSubmitLoading) {
                      setSelectedPool(null);
                      setShowSelectNetworkPage(true);
                    }
                  }}
                >
                  {!selectedNetwork && <span>Select a network</span>}
                  {selectedNetwork !== null && (
                    <span>
                      <img
                        src={selectedNetwork.logoURI}
                        alt={selectedNetwork.name}
                      />
                      {selectedNetwork.name}
                    </span>
                  )}
                  <span>
                    <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                  </span>
                </TokenSelect>
              </SelectNetworkContainer>

              <Heading>Select Pair</Heading>
              <SelectPairContainer>
                <TokenSelect
                  onClick={() => {
                    if (!isSubmitLoading) {
                      setSelectedPool(null);
                      setShowSelectTokenPage(true);
                      setSelectedTokenIndex(0);
                    }
                  }}
                >
                  {!selectedTokens[0] && <span>Select a token</span>}
                  {selectedTokens[0] && (
                    <span>
                      <img
                        src={selectedTokens[0].logoURI}
                        alt={selectedTokens[0].name}
                      />
                      {selectedTokens[0].symbol}
                    </span>
                  )}
                  <span>
                    <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                  </span>
                </TokenSelect>
                <TokenSelect
                  onClick={() => {
                    if (!isSubmitLoading) {
                      setSelectedPool(null);
                      setShowSelectTokenPage(true);
                      setSelectedTokenIndex(1);
                    }
                  }}
                >
                  {!selectedTokens[1] && <span>Select a token</span>}
                  {selectedTokens[1] && (
                    <span>
                      <img
                        src={selectedTokens[1].logoURI}
                        alt={selectedTokens[1].name}
                      />
                      {selectedTokens[1].symbol}
                    </span>
                  )}
                  <span>
                    <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                  </span>
                </TokenSelect>
              </SelectPairContainer>

              <Heading>Select Fee Tier</Heading>
              <FeeTiersContainer>
                <Tier
                  style={getFeeTierStyle("100")}
                  onClick={() => {
                    if (!isSubmitLoading) {
                      const tier = getFeeTier("100");
                      tier && setSelectedPool(tier);
                    }
                  }}
                >
                  <h4 style={!getFeeTier("100") ? { color: "#999" } : {}}>
                    0.01%
                  </h4>
                  <span>Best for very stable pairs.</span>
                  <div>{getFeeTierPercentage("100")}</div>
                </Tier>
                <Tier
                  style={getFeeTierStyle("500")}
                  onClick={() => {
                    if (!isSubmitLoading) {
                      const tier = getFeeTier("500");
                      tier && setSelectedPool(tier);
                    }
                  }}
                >
                  <h4 style={!getFeeTier("500") ? { color: "#999" } : {}}>
                    0.05%
                  </h4>
                  <span>Best for stable pairs.</span>
                  <div>{getFeeTierPercentage("500")}</div>
                </Tier>
                <Tier
                  style={getFeeTierStyle("3000")}
                  onClick={() => {
                    if (!isSubmitLoading) {
                      const tier = getFeeTier("3000");
                      tier && setSelectedPool(tier);
                    }
                  }}
                >
                  <h4 style={!getFeeTier("3000") ? { color: "#999" } : {}}>
                    0.3%
                  </h4>
                  <span>Best for most pairs.</span>
                  <div>{getFeeTierPercentage("3000")}</div>
                </Tier>
                <Tier
                  style={getFeeTierStyle("10000")}
                  onClick={() => {
                    if (!isSubmitLoading) {
                      const tier = getFeeTier("10000");
                      tier && setSelectedPool(tier);
                    }
                  }}
                >
                  <h4 style={!getFeeTier("10000") ? { color: "#999" } : {}}>
                    1%
                  </h4>
                  <span>Best for exotic pairs.</span>
                  <div>{getFeeTierPercentage("10000")}</div>
                </Tier>
              </FeeTiersContainer>

              <PrimaryBlockButton
                onClick={handleSubmit}
                disabled={isFormDisabled}
                style={
                  isFormDisabled
                    ? {
                        background: "rgba(255, 255, 255, 0.1)",
                        cursor: "not-allowed",
                      }
                    : {}
                }
              >
                {isSubmitLoading && (
                  <ReactLoading
                    type="spin"
                    color="rgba(34, 114, 229, 1)"
                    height={18}
                    width={18}
                  />
                )}
                {!isSubmitLoading && <span>Calculate</span>}
              </PrimaryBlockButton>
            </Container>
          </>
        )}
      </Modal>
    </>
  );
};

export default SelectPairModal;

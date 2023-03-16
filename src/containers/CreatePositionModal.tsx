import React, { useState } from "react";
import ReactLoading from "react-loading";
import Modal from "react-modal";
import { useModalContext } from "../context/modal/modalContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faQuestionCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { ModalActionType } from "../context/modal/modalReducer";
import ReactTooltip from "react-tooltip";
import {
  Br,
  PrimaryButton,
  PrimaryDarkBlockButton,
} from "../common/components/atomic";
import { useAppContext } from "../context/app/appContext";
import {
  getPositionTokensDepositRatio,
  getPriceFromTick,
} from "../utils/uniswapv3/math";
import { round } from "../utils/math";
import { getCurrentNetwork } from "../common/network";
import { Token as TokenType } from "../common/interfaces/uniswap.interface";
import { getCurrentTick } from "../repos/uniswap";
import { AppActionType } from "../context/app/appReducer";

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
  width: 370px;
  padding: 15px;
`;
const Header = styled.h1`
  color: white;
  margin: 0;
  font-weight: bold;
  font-size: 1.1rem;
  color: #ddd;
  font-weight: 500;
  display: flex;
  padding: 15px;
  align-items: center;
  background: rgb(50, 50, 50);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  & span:nth-child(1) {
    font-size: 1.1rem;
  }
  & span:nth-child(2) {
    cursor: pointer;
    margin-right: 7px;
  }
`;

const InputGroup = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);

  & .fiat {
    color: #999;
    margin-left: 12px;
    margin-top: -7px;
    margin-bottom: 10px;
    font-size: 0.785rem;
  }

  & .amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;

    & input {
      background: transparent;
      border: 0;
      outline: none;
      color: white;
      font-size: 24px;
      font-weight: 500;
      width: 200px;
    }
    & .token {
      color: white;
      display: flex;
      align-items: center;
      font-weight: bold;

      background: rgba(255, 255, 255, 0.1);
      padding: 3px;
      padding-right: 8px;
      border-radius: 5rem;

      & img {
        width: 25px;
        height: 25px;
        margin-right: 5px;
        border-radius: 50%;
      }
    }
  }
`;
export const Table = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 3.5rem;
  grid-gap: 8px;

  padding: 6px 12px;
  margin-top: 7px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #aaa;

  & > div:nth-child(2) {
    text-align: right;
  }
  & > div:nth-child(3) {
    text-align: left;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 5rem;
    text-align: center;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

interface DepositAmountSectionProps {
  onSubmit: (token0Amount: number, token1Amount: number) => void;
}
const DepositAmountSection = ({ onSubmit }: DepositAmountSectionProps) => {
  const appContext = useAppContext();
  const [token0Amount, setToken0Amount] = useState<number | null>(null);
  const [token1Amount, setToken1Amount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const token0USDValue =
    (token0Amount || 0) *
    (appContext.state.token0PriceChart?.currentPriceUSD || 0);
  const token1USDValue =
    (token1Amount || 0) *
    (appContext.state.token1PriceChart?.currentPriceUSD || 0);

  const isFormDisabled =
    (token0Amount || 0) < 0 ||
    (token1Amount || 0) < 0 ||
    token0USDValue + token1USDValue === 0 ||
    isLoading;

  const handleSubmit = async () => {
    if (isFormDisabled) return;

    setIsLoading(true);
    const poolId = appContext.state.pool?.id;
    if (poolId) {
      const currentTick = await getCurrentTick(poolId);
      const priceRangeValue = appContext.state.priceRangeValue;
      const priceAssumptionValue = appContext.state.priceAssumptionValue;

      appContext.dispatch({
        type: AppActionType.UPDATE_POOL_TICK,
        payload: currentTick,
      });

      // Reset to prev state
      setTimeout(() => {
        appContext.dispatch({
          type: AppActionType.UPDATE_PRICE_RANGE,
          payload: priceRangeValue,
        });
        appContext.dispatch({
          type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
          payload: priceAssumptionValue,
        });
      }, 1000);

      onSubmit(token0Amount || 0, token1Amount || 0);

      // Plausible Feature Tracking
      const props = {
        featureId: "Create Position",
      };
      if (typeof window.plausible !== "undefined") {
        window.plausible("FeatureUsage", {
          props,
        });
      }
    } else {
      console.error("Error: poolId not found", appContext.state.pool);
    }
    setIsLoading(false);
  };

  return (
    <>
      <span style={{ color: "#999", fontSize: "0.875rem" }}>
        Please specify the amount of token you want to deposit into the
        position.
      </span>
      <Br />
      <InputGroup style={{ marginBottom: 8 }}>
        <div className="amount">
          <input
            type="number"
            disabled={isLoading}
            placeholder="0"
            onChange={(e) => setToken0Amount(Number(e.target.value))}
          />
          <div className="token">
            <img src={appContext.state.token0?.logoURI} />
            <span>{appContext.state.token0?.symbol}</span>
          </div>
        </div>
        <div className="fiat">${token0USDValue.toFixed(2)}</div>
      </InputGroup>
      <InputGroup>
        <div className="amount">
          <input
            type="number"
            disabled={isLoading}
            placeholder="0"
            onChange={(e) => setToken1Amount(Number(e.target.value))}
          />
          <div className="token">
            <img src={appContext.state.token1?.logoURI} />
            <span>{appContext.state.token1?.symbol}</span>
          </div>
        </div>
        <div className="fiat">${token1USDValue.toFixed(2)}</div>
      </InputGroup>
      <Br />
      <PrimaryDarkBlockButton
        onClick={handleSubmit}
        disabled={isFormDisabled}
        style={
          isFormDisabled
            ? {
                background: "rgba(255, 255, 255, 0.1)",
                color: "#999",
                cursor: "not-allowed",
              }
            : {}
        }
      >
        {isLoading && (
          <ReactLoading
            type="spin"
            color="rgba(34, 114, 229, 1)"
            height={18}
            width={18}
          />
        )}
        {!isLoading && <>Calculate Swap Route</>}
      </PrimaryDarkBlockButton>
    </>
  );
};

const Stepper = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-top: 0;
  margin-bottom: 0;

  & li {
    display: flex;
    position: relative;
    flex-direction: column;

    & a {
      color: #fff;
      text-decoration: none;
      display: flex;
      align-items: center;
    }
    & a .circle {
      color: #fff;
      background: #1470f1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      font-weight: bold;
      margin-right: 8px;
    }
    & a .label {
      font-weight: 500;
    }

    & .step-content {
      display: block;
      margin-top: 0;
      margin-left: 35px;
      padding: 8px 0;
      margin-bottom: 8px;
      box-sizing: inherit;
    }
  }

  & li:not(:last-child):after {
    content: " ";
    position: absolute;
    width: 1px;
    height: calc(100% - 40px);
    left: 13px;
    top: 33px;
    background-color: rgba(255, 255, 255, 0.1);
  }

  & .step-content .desc {
    color: #999;
    font-size: 0.875rem;
  }
  & .step-content.step1 {
    & a {
      color: #4c82fb;
      font-weight: bold;
      font-size: 0.875rem;
    }
  }

  & .swap-container {
    margin-top: 12px;
    margin-bottom: 8px;
    position: relative;

    & svg {
      color: #ddd;
      position: absolute;
      font-size: 0.8rem;

      top: 27.5px;
      left: 10.5px;
    }
  }

  & .step-content .warning {
    color: #fd4040;
    background: rgba(253, 64, 64, 0.1);
    border-radius: 8px;
    padding: 8px 3px;
    margin-top: 24px;
    margin-bottom: 8px;
    text-align: center;
    font-size: 0.675rem;
  }
`;
const Token = styled.div`
  display: flex;
  align-items: center;

  & > img {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    transform: translateX(-5px);
  }
`;
const PriceRange = styled.div`
  position: relative;
  height: 35px;
  margin-bottom: 8px;

  & > .bar {
    width: 100%;
    height: 3px;
    border-radius: 5rem;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(12.5px);
  }
  & > .lower,
  .upper,
  .price {
    position: absolute;
    width: 7px;
    height: 22px;
    cursor: zoom-in;
    border-top-left-radius: 5rem;
    border-top-right-radius: 5rem;
    border-bottom-left-radius: 5rem;
    border-bottom-right-radius: 5rem;
  }

  & > .lower {
    left: 10px;
    transform: translateX(50%);
    background: #25af60;
  }
  & > .price {
    left: 50%;
    background: #f70377;
    transform: translateX(-50%);
  }
  & > .upper {
    right: 10px;
    transform: translateX(-50%);
    background: #25af60;
  }

  & > .info {
    color: #999;
    font-size: 0.675rem;
    text-align: center;
    margin-top: 24px;
  }
`;

interface InstructionSectionProps {
  amount0: number;
  amount1: number;
}
const InstructionSection = ({ amount0, amount1 }: InstructionSectionProps) => {
  const { state } = useAppContext();

  const P = getPriceFromTick(
    (state.isPairToggled ? -1 : 1) * Number(state.pool?.tick),
    state.token0?.decimals || "18",
    state.token1?.decimals || "18"
  );
  let Pl = state.priceRangeValue[0];
  let Pu = state.priceRangeValue[1];
  if (state.isFullRange && state.poolTicks) {
    const firstTick = state.poolTicks[0];
    const lastTick = state.poolTicks[state.poolTicks.length - 1];
    Pl = Number(firstTick.price0);
    Pu = Number(lastTick.price0);
  }
  const depositRatio = getPositionTokensDepositRatio(P, Pl, Pu);

  // An amount that no need to swap
  let amt0 = 0;
  let amt1 = 0;
  if (amount0 * (1 / depositRatio) <= amount1) {
    amt0 = amount0;
    amt1 = amount0 * (1 / depositRatio);
  }
  if (amount1 * depositRatio <= amount0) {
    amt0 = amount1 * depositRatio;
    amt1 = amount1;
  }

  // An amount that need to swap to get correct deposit ratio
  const remaining0 = amount0 - amt0;
  const remaining1 = amount1 - amt1;

  // Calculate deposit ratio on the remaining amounts
  // Derived from: depositRatio = (remaining0 - swap0) / (swap0 * 1/P)
  const swap0 = remaining0 / (1 + depositRatio / P);
  // Derived from: depositRatio = (swap1 * P) / (remaining1 - swap1)
  const swap1 = (depositRatio * remaining1) / (P + depositRatio);

  const isSwap0 = swap0 > 0;
  const tokenA = isSwap0 ? state.token0 : state.token1;
  const tokenB = isSwap0 ? state.token1 : state.token0;

  // Step 1
  const srcTokenSwapAmount = round(
    isSwap0 ? swap0 : swap1,
    Number(tokenA?.decimals || 18)
  );
  const destTokenSwapAmount = round(
    srcTokenSwapAmount * (isSwap0 ? 1 / P : P),
    Number(tokenB?.decimals || 18)
  );

  // Step 2
  const srcTokenFinalAmount = round(
    isSwap0 ? amt0 + (amount0 - swap0) : amt1 + (amount1 - swap1),
    Number(tokenA?.decimals || 18)
  );
  const destTokenFinalAmount = round(
    (isSwap0 ? amt1 + (amount1 - swap1) : amt0 + (amount0 - swap0)) +
      destTokenSwapAmount,
    Number(tokenB?.decimals || 18)
  );

  const isNative = (token: TokenType | null) => {
    if (!token) return false;

    const platform = getCurrentNetwork().id;
    if (
      ["ethereum", "optimism", "arbitrum"].includes(platform) &&
      token.symbol === "ETH"
    ) {
      return true;
    }
    if (platform === "polygon" && token.symbol === "MATIC") {
      return true;
    }
    if (platform === "bnb" && token.symbol === "BNB") {
      return true;
    }
    return false;
  };

  return (
    <>
      <Stepper>
        <li>
          <a href="#!">
            <span className="circle">1</span>
            <span className="label">
              Swap {tokenA?.symbol} to {tokenB?.symbol} on{" "}
              {getCurrentNetwork().name}
            </span>
          </a>

          <div className="step-content step1">
            <div className="desc">
              Swap the token below to get the correct deposit ratio for the
              position.
            </div>
            <div className="swap-container">
              <FontAwesomeIcon icon={faArrowDown} />
              <Table>
                <Token>
                  <img alt={tokenA?.name} src={tokenA?.logoURI} />{" "}
                  <span>{tokenA?.symbol}</span>
                </Token>
                <div>{round(srcTokenSwapAmount, 6)}</div>
                <div
                  onClick={() =>
                    navigator.clipboard.writeText(`${srcTokenSwapAmount}`)
                  }
                >
                  COPY
                </div>
              </Table>
              <Table>
                <Token>
                  <img alt={tokenB?.name} src={tokenB?.logoURI} />{" "}
                  <span>{tokenB?.symbol}</span>
                </Token>
                <div>{round(destTokenSwapAmount, 6)}</div>
                <div
                  onClick={() =>
                    navigator.clipboard.writeText(`${destTokenSwapAmount}`)
                  }
                >
                  COPY
                </div>
              </Table>
            </div>
            <a
              href={`https://app.uniswap.org/#/swap?exactField=input&exactAmount=${srcTokenSwapAmount}&inputCurrency=${
                isNative(tokenA) ? "ETH" : tokenA?.id
              }&outputCurrency=${isNative(tokenB) ? "ETH" : tokenB?.id}`}
              target="_blank"
            >
              Swap on Uniswap V3
            </a>
          </div>
        </li>

        <li>
          <a href="#!">
            <span className="circle">2</span>
            <span className="label">Total Tokens Amount (After Swap)</span>
          </a>

          <div className="step-content">
            <Table>
              <Token>
                <img alt={tokenA?.name} src={tokenA?.logoURI} />{" "}
                <span>{tokenA?.symbol}</span>
              </Token>
              <div>{round(srcTokenFinalAmount, 6)}</div>
              <div
                onClick={() =>
                  navigator.clipboard.writeText(`${srcTokenFinalAmount}`)
                }
              >
                COPY
              </div>
            </Table>
            <Table>
              <Token>
                <img alt={tokenB?.name} src={tokenB?.logoURI} />{" "}
                <span>{tokenB?.symbol}</span>
              </Token>
              <div>{round(destTokenFinalAmount, 6)}</div>
              <div
                onClick={() =>
                  navigator.clipboard.writeText(`${destTokenFinalAmount}`)
                }
              >
                COPY
              </div>
            </Table>
          </div>
        </li>

        <li>
          <ReactTooltip id="price-range" />
          <a href="#!">
            <span className="circle">3</span>
            <span className="label">Create Position</span>
          </a>

          <div className="step-content" style={{ marginBottom: 0 }}>
            <PriceRange>
              <div className="bar"></div>
              <div
                style={{ opacity: state.isFullRange ? 0.4 : 1 }}
                className="lower"
                data-for="price-range"
                data-place="right"
                data-html={true}
                data-tip={
                  state.isFullRange
                    ? `Lower Price: 0`
                    : `Lower Price<br>${round(Pl, 6)} ${state.token0?.symbol}/${
                        state.token1?.symbol
                      }<br><br>(Click to copy to clipboard)`
                }
                onClick={() =>
                  state.isFullRange
                    ? ""
                    : navigator.clipboard.writeText(`${Pl}`)
                }
              ></div>
              <div
                style={{ opacity: state.isFullRange ? 0.4 : 1 }}
                className="upper"
                data-for="price-range"
                data-place="left"
                data-html={true}
                data-tip={
                  state.isFullRange
                    ? `Upper Price: ∞`
                    : `Upper Price<br>${round(Pu, 6)} ${state.token0?.symbol}/${
                        state.token1?.symbol
                      }<br><br>(Click to copy to clipboard)`
                }
                onClick={() =>
                  state.isFullRange
                    ? ""
                    : navigator.clipboard.writeText(`${Pu}`)
                }
              ></div>

              <div
                className="price"
                data-for="price-range"
                data-place="bottom"
                data-html={true}
                data-tip={`Current Price<br>${round(P, 6)} ${
                  state.token0?.symbol
                }/${state.token1?.symbol}<br><br>(Click to copy to clipboard)`}
                onClick={() => navigator.clipboard.writeText(`${P}`)}
              ></div>

              <div className="info">Hover to see the price range info</div>
            </PriceRange>
            <div className="warning">
              Please switch the network to {getCurrentNetwork().name} and ensure
              all information is correct before creating the position.
            </div>
            <div>
              <a
                href={`https://app.uniswap.org/#/add/${
                  isNative(state.token1) ? "ETH" : state.token1?.id
                }/${isNative(state.token0) ? "ETH" : state.token0?.id}/${
                  state.pool?.feeTier
                }${state.isFullRange ? "" : `?minPrice=${Pl}&maxPrice=${Pu}`}`}
                target="_blank"
              >
                <PrimaryButton style={{ width: "100%" }}>
                  Create Position on Uniswap V3
                </PrimaryButton>
              </a>
            </div>
          </div>
        </li>
      </Stepper>
    </>
  );
};

const CreatePositionModal = () => {
  const { state, dispatch } = useModalContext();
  const [token0Amount, setToken0Amount] = useState<number | null>(null);
  const [token1Amount, setToken1Amount] = useState<number | null>(null);

  return (
    <>
      <Modal
        style={ModalStyle}
        isOpen={state.isCreatePositionModalOpen}
        contentLabel="CREATE POSITION"
        ariaHideApp={false}
      >
        <>
          <ReactTooltip id="create-position" />
          <Header>
            <span>
              Create Position
              <FontAwesomeIcon
                style={{ opacity: 0.3, marginLeft: 5 }}
                data-for="create-position"
                data-place="bottom"
                data-html={true}
                data-tip={`
                <div style="width: 250px;">
                  This feature will instruct you how to create a position and help you calculate the deposit tokens amount for current price range setting.
                  <br><br>
                  Noted that <b>there is no smart contract risk evolve</b> since you will be the one who creates a new position yourself on the official Uniswap interface. This feature only gives you "Instruction."
                  <br><br>
                  Disclaimer: <b>we will not take any responsibility of your funds</b>, so please ensure that all the information is correct, as you will, before performing any transactions.
                </div>
                `}
                icon={faQuestionCircle}
              />
            </span>
            <span
              onClick={() => {
                dispatch({
                  type: ModalActionType.SET_CREATE_POSITION_MODAL_STATE,
                  payload: false,
                });
                // Reset state
                setToken0Amount(null);
                setToken1Amount(null);
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </Header>
          <Container>
            {token0Amount === null && token1Amount === null ? (
              <DepositAmountSection
                onSubmit={(token0Amount, token1Amount) => {
                  setToken0Amount(token0Amount);
                  setToken1Amount(token1Amount);
                }}
              />
            ) : (
              <InstructionSection
                amount0={token0Amount || 0}
                amount1={token1Amount || 0}
              />
            )}
          </Container>
        </>
      </Modal>
    </>
  );
};

export default CreatePositionModal;

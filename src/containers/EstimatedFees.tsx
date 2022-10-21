import React from "react";
import styled from "styled-components";
import { Dollar, Heading, Table } from "../common/components";
import { useAppContext } from "../context/app/appContext";
import bn from "bignumber.js";
import {
  calculateFee,
  getLiquidityForAmounts,
  getLiquidityFromTick,
  getSqrtPriceX96,
  getTickFromPrice,
  getTokensAmountFromDepositAmountUSD,
} from "../utils/uniswapv3/math";
import { ScreenWidth } from "../utils/styled";
import { Tick } from "../common/interfaces/uniswap.interface";

const SettingContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;

  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    padding: 12px;
    border-radius: 12px;
  }
`;
const Fee = styled.span`
  display: block;
  color: rgb(37, 175, 96);
  font-weight: 500;
  font-size: 2.4rem;
  margin-top: -10px;

  & > span {
    margin-right: 3px;
    display: inline-block;
    font-weight: 600;
    transform: translateY(2px);
  }
`;
const Tag = styled.div`
  display: inline-block;
  color: rgba(255, 255, 255, 0.3);
`;

const EstimatedFees = () => {
  const { state } = useAppContext();

  const P = state.priceAssumptionValue;
  const Pl = state.priceRangeValue[0];
  const Pu = state.priceRangeValue[1];
  const priceUSDX = state.token1PriceChart?.currentPriceUSD || 1;
  const priceUSDY = state.token0PriceChart?.currentPriceUSD || 1;
  const depositAmountUSD = state.depositAmountValue;

  const { amount0, amount1 } = getTokensAmountFromDepositAmountUSD(
    P,
    Pl,
    Pu,
    priceUSDX,
    priceUSDY,
    depositAmountUSD
  );

  // TODO: refactor this section
  const sqrtRatioX96 = getSqrtPriceX96(
    P,
    state.token0?.decimals || "18",
    state.token1?.decimals || "18"
  );
  const sqrtRatioAX96 = getSqrtPriceX96(
    Pl,
    state.token0?.decimals || "18",
    state.token1?.decimals || "18"
  );
  const sqrtRatioBX96 = getSqrtPriceX96(
    Pu,
    state.token0?.decimals || "18",
    state.token1?.decimals || "18"
  );

  const deltaL = getLiquidityForAmounts(
    sqrtRatioX96,
    sqrtRatioAX96,
    sqrtRatioBX96,
    amount0,
    Number(state.token1?.decimals || 18),
    amount1,
    Number(state.token0?.decimals || 18)
  );

  let currentTick = getTickFromPrice(
    P,
    state.token0?.decimals || "18",
    state.token1?.decimals || "18"
  );

  if (state.isSwap) currentTick = -currentTick;

  const L = getLiquidityFromTick(state.poolTicks || [], currentTick);
  const volume24H = state.volume24H;
  const feeTier = state.pool?.feeTier || "";

  let fee = calculateFee(deltaL, L, volume24H, feeTier);
  if (P < Pl || P > Pu) fee = 0;

  return (
    <SettingContainer>
      <Heading>
        Estimated Fees <Tag>(24h)</Tag>
      </Heading>
      <Fee>
        <Dollar>$</Dollar>
        {fee.toFixed(2)}
      </Fee>

      <Table>
        <div>MONTHLY</div>
        <div>${(fee * 30).toFixed(2)}</div>
        <div>{((100 * (fee * 30)) / depositAmountUSD).toFixed(2)}%</div>
      </Table>
      <Table>
        <div>YEARLY (APR)</div>
        <div>${(fee * 365).toFixed(2)}</div>
        <div>{((100 * (fee * 365)) / depositAmountUSD).toFixed(2)}%</div>
      </Table>
    </SettingContainer>
  );
};

export default EstimatedFees;

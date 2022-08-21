import React from "react";
import styled from "styled-components";
import { Heading } from "../common/atomic";
import Table from "../common/Table";
import { useAppContext } from "../context/app/appContext";
import { Tick } from "../repos/uniswap";
import bn from "bignumber.js";
import {
  calculateFee,
  getLiquidityForAmounts,
  getSqrtPriceX96,
  getTickFromPrice,
  getTokenAmountsFromDepositAmounts,
} from "../utils/liquidityMath";

const SettingContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
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

  const calculateLiquidity = (ticks: Tick[], currentTick: number): bn => {
    if (ticks.length <= 1) return new bn(0);
    let liquidity: bn = new bn(0);
    for (let i = 0; i < ticks.length - 1; ++i) {
      liquidity = liquidity.plus(new bn(ticks[i].liquidityNet));

      let lowerTick = Number(ticks[i].tickIdx);
      let upperTick = Number(ticks[i + 1].tickIdx);

      if (lowerTick <= currentTick && currentTick <= upperTick) {
        break;
      }
    }

    return liquidity;
  };

  const P = state.priceAssumptionValue;
  const Pl = state.priceRangeValue[0];
  const Pu = state.priceRangeValue[1];
  const priceUSDX = state.token1PriceChart?.currentPriceUSD || 1;
  const priceUSDY = state.token0PriceChart?.currentPriceUSD || 1;
  const targetAmounts = state.depositAmountValue;

  const { amount0, amount1 } = getTokenAmountsFromDepositAmounts(
    P,
    Pl,
    Pu,
    priceUSDX,
    priceUSDY,
    targetAmounts
  );

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

  const L = calculateLiquidity(state.poolTicks || [], currentTick);
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
        <span className="dollar">$</span>
        {fee.toFixed(2)}
      </Fee>

      <Table>
        <div>MONTHLY</div>
        <div>${(fee * 30).toFixed(2)}</div>
        <div>{((100 * (fee * 30)) / targetAmounts).toFixed(2)}%</div>
      </Table>
      <Table>
        <div>YEARLY (APR)</div>
        <div>${(fee * 365).toFixed(2)}</div>
        <div>{((100 * (fee * 365)) / targetAmounts).toFixed(2)}%</div>
      </Table>
    </SettingContainer>
  );
};

export default EstimatedFees;

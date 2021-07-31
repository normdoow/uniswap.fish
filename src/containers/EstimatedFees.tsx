import React from "react";
import styled from "styled-components";
import { Heading } from "../common/atomic";
import Table from "../common/Table";
import { useAppContext } from "../context/app/appContext";
import { Tick } from "../repos/uniswap";
import { expandDecimals } from "../utils/math";
import { getFeeTierPercentage } from "../utils/helper";
import bn from "bignumber.js";

const SettingContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
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

  const calculateLiquidity = (ticks: Tick[], currentPrice: number): bn => {
    if (ticks.length <= 1) return new bn(0);
    let liquidity: bn = new bn(0);
    for (let i = 0; i < ticks.length - 1; ++i) {
      liquidity = liquidity.plus(new bn(ticks[i].liquidityNet));

      const upperPrice = Number(ticks[i].price1);
      const lowerPrice = Number(ticks[i + 1].price1);

      if (lowerPrice <= currentPrice && currentPrice <= upperPrice) {
        break;
      }
    }

    return liquidity;
  };

  const calculateLiquidityPercentage = (L: bn, deltaL: number): number => {
    const exp = Math.floor(
      (Number(state.token0?.decimals || 18) +
        Number(state.token1?.decimals || 18)) /
        2
    );
    const _deltaL = expandDecimals(deltaL, exp);
    return _deltaL.div(L.plus(_deltaL)).toNumber();
  };

  const P = state.priceAssumptionValue;
  const Pu = state.priceRangeValue[1];
  const Pl = state.priceRangeValue[0];
  const priceUSDX = state.token1PriceChart?.currentPriceUSD || 1;
  const priceUSDY = state.token0PriceChart?.currentPriceUSD || 1;
  const targetAmounts = state.depositAmountValue;
  const volume24H = state.volume24H;
  const feeTier = getFeeTierPercentage(state.pool?.feeTier || "");

  let deltaL =
    targetAmounts /
    ((Math.sqrt(P) - Math.sqrt(Pl)) * priceUSDY +
      (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu)) * priceUSDX);
  if (P < Pl || P > Pu) deltaL = 0;

  const L = calculateLiquidity(state.poolTicks || [], P);

  const fee = feeTier * volume24H * calculateLiquidityPercentage(L, deltaL);

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

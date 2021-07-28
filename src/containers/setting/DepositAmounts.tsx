import { useState } from "react";
import styled from "styled-components";
import { Heading } from "../../common/atomic";
import Table from "../../common/Table";
import { useAppContext } from "../../context/app/appContext";
import { AppActionType } from "../../context/app/appReducer";

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 6px 8px;

  & > span {
    color: white;
    font-size: 2rem;
    margin-right: 5px;
    font-family: sans-serif;
    font-weight: bold;
    transform: translateY(-1.5px);
  }
`;
const DepositInput = styled.input`
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
  color: white;
  font-weight: 600;
  font-size: 2rem;

  &:focus {
    outline: none;
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

const DepositAmounts = () => {
  const { state, dispatch } = useAppContext();

  const roundPercentage = (percent: number) => {
    if (percent < 0) return 0;
    if (percent > 1) return 1;
    return percent;
  };

  const max = state.priceRangeValue[1];
  const min = state.priceRangeValue[0];
  const percentToken0 = roundPercentage(
    (state.priceAssumptionValue - min) / (max - min)
  );
  const percentToken1 = roundPercentage(
    (max - state.priceAssumptionValue) / (max - min)
  );

  const token0PriceUSD = state.token0PriceChart?.currentPriceUSD || 1;
  const token1PriceUSD = state.token1PriceChart?.currentPriceUSD || 1;

  return (
    <div>
      <Heading>Deposit Amounts</Heading>
      <InputGroup>
        <span className="dollar">$</span>
        <DepositInput
          value={state.depositAmountValue}
          type="number"
          placeholder="0.00"
          onChange={(e) => {
            let value = Number(e.target.value);
            if (value < 0) value = 0;

            dispatch({
              type: AppActionType.UPDATE_DEPOSIT_AMOUNT,
              payload: value,
            });
          }}
        />
      </InputGroup>

      <Table>
        <Token>
          <img alt={state.token0?.name} src={state.token0?.logoURI} />{" "}
          <span>{state.token0?.symbol}</span>
        </Token>
        <div>
          {(
            (state.depositAmountValue * percentToken0) /
            token0PriceUSD
          ).toFixed(5)}
        </div>
        <div>${(state.depositAmountValue * percentToken0).toFixed(2)}</div>
      </Table>
      <Table>
        <Token>
          <img alt={state.token1?.name} src={state.token1?.logoURI} />{" "}
          <span>{state.token1?.symbol}</span>
        </Token>
        <div>
          {(
            (state.depositAmountValue * percentToken1) /
            token1PriceUSD
          ).toFixed(5)}
        </div>
        <div>${(state.depositAmountValue * percentToken1).toFixed(2)}</div>
      </Table>
    </div>
  );
};

export default DepositAmounts;

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

  // for calculation detail, please visit README.md (Section: Calculation Breakdown, No. 1)
  const P = state.priceAssumptionValue;
  const Pu = state.priceRangeValue[1];
  const Pl = state.priceRangeValue[0];
  const priceUSDX = state.token1PriceChart?.currentPriceUSD || 1;
  const priceUSDY = state.token0PriceChart?.currentPriceUSD || 1;
  const targetAmounts = state.depositAmountValue;

  const deltaL =
    targetAmounts /
    ((Math.sqrt(P) - Math.sqrt(Pl)) * priceUSDY +
      (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu)) * priceUSDX);

  let deltaY = deltaL * (Math.sqrt(P) - Math.sqrt(Pl));
  if (deltaY * priceUSDY < 0) deltaY = 0;
  if (deltaY * priceUSDY > targetAmounts) deltaY = targetAmounts / priceUSDY;

  let deltaX = deltaL * (1 / Math.sqrt(P) - 1 / Math.sqrt(Pu));
  if (deltaX * priceUSDX < 0) deltaX = 0;
  if (deltaX * priceUSDX > targetAmounts) deltaX = targetAmounts / priceUSDX;

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
        <div>{deltaY.toFixed(5)}</div>
        <div>${(deltaY * priceUSDY).toFixed(2)}</div>
      </Table>
      <Table>
        <Token>
          <img alt={state.token1?.name} src={state.token1?.logoURI} />{" "}
          <span>{state.token1?.symbol}</span>
        </Token>
        <div>{deltaX.toFixed(5)}</div>
        <div>${(deltaX * priceUSDX).toFixed(2)}</div>
      </Table>
    </div>
  );
};

export default DepositAmounts;

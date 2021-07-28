import { useEffect } from "react";
import styled from "styled-components";
import { Heading } from "../../common/atomic";
import { useAppContext } from "../../context/app/appContext";
import { AppActionType } from "../../context/app/appReducer";
import Slider from "./Slider";

const Group = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 8px;
  border-radius: 12px;
`;
const InputGroup = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 8px;
  border-radius: 12px;
  margin-top: 2px;
  & > span {
    font-size: 0.8rem;
    text-align: center;
    color: #999;
    display: block;
    text-align: center;
  }
`;
const Input = styled.input`
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
  color: white;
  font-weight: 400;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 3px;

  &:focus {
    outline: none;
  }
`;
const MinMaxPriceContainer = styled.div`
  display: grid;
  grid-gap: 7px;
  grid-template-columns: repeat(2, 1fr);

  margin-bottom: 7px;
`;

const PriceRange = () => {
  const { state, dispatch } = useAppContext();

  const currentPrice = Number(state.pool?.token0Price);
  const min = 0;
  const max = 10000;

  useEffect(() => {
    dispatch({
      type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
      payload: currentPrice,
    });
  }, []);

  return (
    <div>
      <Heading>Price Range</Heading>
      <Group>
        <MinMaxPriceContainer>
          <InputGroup>
            <span>Min Price</span>
            <Input type="number" placeholder="0.0" />
            <span>UNI per ETH</span>
          </InputGroup>
          <InputGroup>
            <span>Max Price</span>
            <Input type="number" placeholder="0.0" />
            <span>UNI per ETH</span>
          </InputGroup>
        </MinMaxPriceContainer>
        {/* <Slider /> */}
      </Group>

      <Group style={{ marginTop: 7 }}>
        <InputGroup>
          <span>Most Active Price Assumption</span>
          <Input
            value={state.priceAssumptionValue}
            type="number"
            placeholder="0.0"
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value > max) value = max;
              if (value < min) value = min;

              dispatch({
                type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
                payload: value,
              });
            }}
          />
          <span>
            {state.token0?.symbol} per {state.token1?.symbol}
          </span>
        </InputGroup>
        <Slider
          value={state.priceAssumptionValue}
          min={0}
          max={10000}
          onChange={(value, _) => {
            dispatch({
              type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
              payload: value,
            });
          }}
        />
      </Group>
    </div>
  );
};

export default PriceRange;

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Switch from "react-switch";
import { Heading } from "../../common/components/atomic";
import { Price } from "../../common/interfaces/coingecko.interface";
import { useAppContext } from "../../context/app/appContext";
import { AppActionType } from "../../context/app/appReducer";
import { divideArray, findMax, findMin } from "../../utils/math";
import Slider from "./Slider";
import { Group, Input, InputGroup } from "../../common/components/atomic";
import AdjustButton from "../../common/components/AdjustButton";

const MinMaxPriceContainer = styled.div`
  display: grid;
  grid-gap: 7px;
  grid-template-columns: repeat(2, 1fr);

  margin-bottom: 7px;
`;
const FullRangeContainer = styled.div`
  display: flex;
  align-items: center;

  & > span {
    font-size: 0.8rem;
    font-weight: 400;
    margin-right: 5px;
    color: #bbb;
  }
`;

const PriceRange = () => {
  const { state, dispatch } = useAppContext();
  const [activePriceAssumptionSlider, setActivePriceAssumptionSlider] =
    useState(0);
  const [priceRangeSlider, setPriceRangeSlider] = useState([0, 0]);
  const isFullRange = state.isFullRange;

  const prices = divideArray(
    (state.token1PriceChart?.prices || []).map((p: Price) => p.value),
    (state.token0PriceChart?.prices || []).map((p: Price) => p.value)
  );

  const currentPrice = Number(state.pool?.token0Price || NaN);

  let _min = findMin(prices);
  let _max = findMax(prices);
  if (state.token0PriceChart === null || state.token1PriceChart === null) {
    _min = currentPrice - currentPrice * 0.3;
    _max = currentPrice + currentPrice * 0.3;
  }
  const margin = _max - _min;

  const min = Math.max(0, _min - margin);
  const max = _max + margin;
  const step = 0.000001;
  const btnStep = ((max - min) * 2) / 100; // 2%

  useEffect(() => {
    if (Number.isNaN(currentPrice)) return;

    dispatch({
      type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
      payload: currentPrice,
    });

    dispatch({
      type: AppActionType.UPDATE_PRICE_RANGE,
      payload: [_min, _max],
    });
  }, [state.pool, _min, _max, currentPrice, dispatch]);

  useEffect(() => {
    // percent = 100 * (price - min) / (max - min)
    setActivePriceAssumptionSlider(
      (100 * (state.priceAssumptionValue - min)) / (max - min)
    );
  }, [state.priceAssumptionValue, min, max]);
  useEffect(() => {
    setPriceRangeSlider([
      (100 * (state.priceRangeValue[0] - min)) / (max - min),
      (100 * (state.priceRangeValue[1] - min)) / (max - min),
    ]);
  }, [state.priceRangeValue, min, max]);

  return (
    <div style={{ marginTop: 7 }}>
      <Heading>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Price Range</span>
          <FullRangeContainer>
            <span style={isFullRange ? { color: "white" } : {}}>
              Full Range:{" "}
            </span>
            <Switch
              checked={isFullRange}
              checkedIcon={false}
              uncheckedIcon={false}
              handleDiameter={18}
              height={24}
              width={45}
              offColor="#333"
              offHandleColor="#777"
              onColor="#2A4174"
              onHandleColor="#608EF7"
              onChange={(checked) =>
                dispatch({
                  type: AppActionType.SET_IS_FULL_RANGE,
                  payload: checked,
                })
              }
            />
          </FullRangeContainer>
        </div>
      </Heading>
      <Group>
        <MinMaxPriceContainer style={isFullRange ? { marginBottom: 2 } : {}}>
          <InputGroup>
            {!isFullRange && (
              <AdjustButton
                onDecrease={() => {
                  dispatch({
                    type: AppActionType.UPDATE_PRICE_RANGE,
                    payload: [
                      state.priceRangeValue[0] - btnStep,
                      state.priceRangeValue[1],
                    ],
                  });
                }}
                onIncrease={() => {
                  dispatch({
                    type: AppActionType.UPDATE_PRICE_RANGE,
                    payload: [
                      state.priceRangeValue[0] + btnStep,
                      state.priceRangeValue[1],
                    ],
                  });
                }}
              />
            )}
            <span>Min Price</span>
            <Input
              value={!isFullRange ? state.priceRangeValue[0] : 0}
              type="number"
              placeholder="0.0"
              disabled={isFullRange}
              onChange={(e) => {
                let value = Number(e.target.value);

                dispatch({
                  type: AppActionType.UPDATE_PRICE_RANGE,
                  payload: [value, state.priceRangeValue[1]],
                });
              }}
            />
            <span>
              {state.token0?.symbol} per {state.token1?.symbol}
            </span>
          </InputGroup>

          <InputGroup>
            {!isFullRange && (
              <AdjustButton
                onDecrease={() => {
                  dispatch({
                    type: AppActionType.UPDATE_PRICE_RANGE,
                    payload: [
                      state.priceRangeValue[0],
                      state.priceRangeValue[1] - btnStep,
                    ],
                  });
                }}
                onIncrease={() => {
                  dispatch({
                    type: AppActionType.UPDATE_PRICE_RANGE,
                    payload: [
                      state.priceRangeValue[0],
                      state.priceRangeValue[1] + btnStep,
                    ],
                  });
                }}
              />
            )}
            <span>Max Price</span>
            <Input
              value={!isFullRange ? state.priceRangeValue[1] : "∞"}
              type={!isFullRange ? "number" : "text"}
              placeholder="0.0"
              disabled={isFullRange}
              onChange={(e) => {
                let value = Number(e.target.value);

                dispatch({
                  type: AppActionType.UPDATE_PRICE_RANGE,
                  payload: [state.priceRangeValue[0], value],
                });
              }}
            />
            <span>
              {state.token0?.symbol} per {state.token1?.symbol}
            </span>
          </InputGroup>
        </MinMaxPriceContainer>
        {!isFullRange && (
          <Slider
            thumbClassName="thumb-green"
            value={priceRangeSlider}
            min={0}
            max={100}
            step={step}
            onChange={(value, _) => {
              setPriceRangeSlider(value);

              dispatch({
                type: AppActionType.UPDATE_PRICE_RANGE,
                payload: [
                  min + ((max - min) * value[0]) / 100,
                  min + ((max - min) * value[1]) / 100,
                ],
              });
            }}
          />
        )}
      </Group>

      <Group style={{ marginTop: 7 }}>
        <InputGroup>
          <AdjustButton
            onDecrease={() => {
              dispatch({
                type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
                payload: state.priceAssumptionValue - btnStep,
              });
            }}
            onIncrease={() => {
              dispatch({
                type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
                payload: state.priceAssumptionValue + btnStep,
              });
            }}
          />

          <span>Most Active Price Assumption</span>
          <Input
            value={state.priceAssumptionValue || 0}
            type="number"
            placeholder="0.0"
            onChange={(e) => {
              let value = Number(e.target.value);

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
          thumbClassName="thumb-red"
          value={activePriceAssumptionSlider}
          min={0}
          max={100}
          step={step}
          onChange={(value, _) => {
            setActivePriceAssumptionSlider(value);

            dispatch({
              type: AppActionType.UPDATE_PRICE_ASSUMPTION_VALUE,
              payload: min + ((max - min) * value) / 100,
            });
          }}
        />
      </Group>
    </div>
  );
};

export default PriceRange;

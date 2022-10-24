import styled from "styled-components";
import { Heading } from "../../common/components";
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

const OutOfRangePercentage = () => {
  const { state, dispatch } = useAppContext();

  return (
    <div>
      <Heading>Out of Range Percentage</Heading>
      <Group>
        <InputGroup>
          <span>Out of Range Percentage</span>
          <Input
            value={state.outOfRangePercentageValue}
            type="number"
            placeholder="0.0"
            min={0}
            max={100}
            onChange={(e) => {
              let value = Number(e.target.value);

              dispatch({
                type: AppActionType.UPDATE_OUT_OF_RANGE_PERCENTAGE,
                payload: value,
              });
            }}
          />
          <span>Percent</span>
        </InputGroup>
        <Slider
          value={state.outOfRangePercentageValue}
          min={0}
          max={100}
          onChange={(value, _) => {
            dispatch({
              type: AppActionType.UPDATE_OUT_OF_RANGE_PERCENTAGE,
              payload: value,
            });
          }}
        />
      </Group>
    </div>
  );
};

export default OutOfRangePercentage;

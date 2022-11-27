import React from "react";
import styled from "styled-components";
import ReactSlider from "react-slider";
import { ScreenWidth } from "../../utils/styled";

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 3px;
  margin-top: 15px;
  margin-bottom: 10px;
`;
const StyledThumb = styled.div`
  height: 20px;
  width: 5px;
  text-align: center;
  background-color: white;
  cursor: grab;
  border-radius: 3px;
  transform: translateY(calc(3px / 2 + -20px / 2));

  @media only screen and (max-width: ${ScreenWidth.TABLET}px) {
    width: 10px;
  }
  @media only screen and (max-width: ${ScreenWidth.MOBILE}px) {
    width: 20px;
    border-radius: 50%;
  }
`;
const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  border-radius: 7px;
  background-color: rgba(255, 255, 255, 0.25);
`;

const Thumb = (props: any) => <StyledThumb {...props} />;

const Track = (props: any) => <StyledTrack {...props} />;

interface SliderProps {
  thumbClassName?: string;
  value: number | number[];
  min: number;
  max: number;
  step?: number;
  onChange: (value: any, index: number) => void;
}
const Slider = (props: SliderProps) => {
  const min = isNaN(props.min) ? 0 : props.min;
  const max = isNaN(props.max) ? 0 : props.max;

  let value;
  if (typeof props.value === "object") {
    const valueArray = [];
    valueArray[0] = isNaN(props.value[0]) ? 0 : props.value[0];
    valueArray[1] = isNaN(props.value[1]) ? 0 : props.value[1];
    value = valueArray;
  } else {
    value = isNaN(props.value) ? 0 : props.value;
  }

  return (
    <StyledSlider
      renderTrack={Track}
      renderThumb={Thumb}
      min={min}
      max={max}
      onChange={props.onChange}
      value={value}
      step={props.step || 1}
      thumbClassName={props.thumbClassName}
    />
  );
};

export default Slider;

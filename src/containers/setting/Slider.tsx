import styled from "styled-components";
import ReactSlider from "react-slider";

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
  onChange: (value: any, index: number) => void;
}
const Slider = (props: SliderProps) => {
  return (
    <StyledSlider
      renderTrack={Track}
      renderThumb={Thumb}
      min={props.min}
      max={props.max}
      onChange={props.onChange}
      value={props.value}
      thumbClassName={props.thumbClassName}
    />
  );
};

export default Slider;

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
  background-color: rgba(37, 175, 96, 1);
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

const Thumb = (props: any, state: any) => <StyledThumb {...props} />;

const Track = (props: any, state: any) => <StyledTrack {...props} />;

const MinMaxRangeSlider = () => {
  return (
    <StyledSlider
      defaultValue={[50, 75]}
      renderTrack={Track}
      renderThumb={Thumb}
    />
  );
};

export default MinMaxRangeSlider;

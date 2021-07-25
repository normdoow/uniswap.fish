import styled from "styled-components";
import { Heading } from "../../common/atomic";

const InputGroup = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 6px 8px;

  & > span {
    font-size: 0.8rem;
    text-align: center;
    color: #999;
    display: block;
    text-align: center;
  }
`;
const PriceRangeInput = styled.input`
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
  color: white;
  font-weight: 400;
  font-size: 1.2rem;
  text-align: center;

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
  return (
    <div>
      <Heading>Price Range</Heading>
      <MinMaxPriceContainer>
        <InputGroup>
          <span>Min Price</span>
          <PriceRangeInput type="number" placeholder="0.0" />
          <span>UNI per ETH</span>
        </InputGroup>
        <InputGroup>
          <span>Max Price</span>
          <PriceRangeInput type="number" placeholder="0.0" />
          <span>UNI per ETH</span>
        </InputGroup>
      </MinMaxPriceContainer>
      <InputGroup>
        <span>Most Active Price Assumption</span>
        <PriceRangeInput type="number" placeholder="0.0" />
        <span>UNI per ETH</span>
      </InputGroup>
    </div>
  );
};

export default PriceRange;

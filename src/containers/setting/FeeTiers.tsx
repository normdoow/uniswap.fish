import styled from "styled-components";
import Heading from "../../common/Heading";

const Tier = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 6px;
  cursor: pointer;

  & h4 {
    color: #ccc;
    margin: 0;
    font-size: 1rem;
  }

  & > span {
    font-size: 0.8rem;
    line-height: 1.2rem;
    margin-top: 5px;
    display: inline-block;
    color: #999;
  }
`;
const FeeTiersContainer = styled.div`
  display: grid;
  grid-gap: 7px;
  grid-template-columns: repeat(3, 1fr);
`;

const FeeTiers = () => {
  return (
    <div>
      <Heading>Fee Tiers</Heading>
      <FeeTiersContainer>
        <Tier>
          <h4>0.05% fee</h4>
          <span>Best for stable pairs.</span>
        </Tier>
        <Tier
          style={{
            border: "1px solid rgba(22, 137, 153, 0.35)",
            background: "rgba(22, 137, 153, 0.15)",
          }}
        >
          <h4>0.3% fee</h4>
          <span>Best for most pairs.</span>
        </Tier>
        <Tier>
          <h4>1% fee</h4>
          <span>Best for exotic pairs.</span>
        </Tier>
      </FeeTiersContainer>
    </div>
  );
};

export default FeeTiers;

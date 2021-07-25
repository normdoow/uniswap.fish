import styled from "styled-components";
import Heading from "../../common/Heading";

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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

const DepositAmounts = () => {
  return (
    <div>
      <Heading>Deposit Amounts</Heading>
      <InputGroup>
        <span>$</span>
        <DepositInput type="number" placeholder="0.00" />
      </InputGroup>
    </div>
  );
};

export default DepositAmounts;

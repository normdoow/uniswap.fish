import styled from "styled-components";
import { Heading } from "../../common/atomic";
import Table from "../../common/Table";
import { useAppContext } from "../../context/app/appContext";

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
  const appContext = useAppContext();

  return (
    <div>
      <Heading>Deposit Amounts</Heading>
      <InputGroup>
        <span className="dollar">$</span>
        <DepositInput type="number" placeholder="0.00" />
      </InputGroup>

      <Table>
        <Token>
          <img
            alt={appContext.state.token0?.name}
            src={appContext.state.token0?.logoURI}
          />{" "}
          <span>{appContext.state.token0?.symbol}</span>
        </Token>
        <div>0.0000023</div>
        <div>$449.99</div>
      </Table>
      <Table>
        <Token>
          <img
            alt={appContext.state.token1?.name}
            src={appContext.state.token1?.logoURI}
          />{" "}
          <span>{appContext.state.token1?.symbol}</span>
        </Token>
        <div>1.19</div>
        <div>$500.00</div>
      </Table>
    </div>
  );
};

export default DepositAmounts;

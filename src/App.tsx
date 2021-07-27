import React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { Br } from "./common/atomic";
import CorrelationChart from "./containers/CorrelationChart";
import Credit from "./containers/Credit";
import EstimatedFees from "./containers/EstimatedFees";
import Header from "./containers/Header";
import Navbar from "./containers/Navbar";
import Setting from "./containers/setting/Setting";
import { getPoolTicks } from "./repos/uniswap";

const BodyContainer = styled.div`
  width: 900px;
  margin: auto auto;
  padding-top: 100px;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 5fr 7fr;
  grid-gap: 25px;
  margin-top: 25px;
`;

function App() {
  useEffect(() => {
    getPoolTicks("0x1d42064fc4beb5f8aaf85f4617ae8b3b5b8bd801").then(
      console.log
    );
  }, []);

  return (
    <>
      <Navbar />
      <BodyContainer>
        <Header />
        <ContentContainer>
          <div>
            <EstimatedFees />
            <Br />
            <Setting />
          </div>
          <div>
            <CorrelationChart />
          </div>
        </ContentContainer>

        <Credit />
      </BodyContainer>
    </>
  );
}

export default App;

import React from "react";
import styled from "styled-components";
import { Br } from "./common/atomic";
import CorrelationChart from "./containers/CorrelationChart";
import Credit from "./containers/Credit";
import EstimatedFees from "./containers/EstimatedFees";
import Header from "./containers/Header";
import Navbar from "./containers/Navbar";
import LiquidityPositionChart from "./containers/LiquidityPositionChart";
import SelectPairModal from "./containers/select-pair/SelectPairModal";
import Setting from "./containers/setting/Setting";
import ContextProvider from "./context/ContextProvider";

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
  return (
    <ContextProvider>
      <SelectPairModal />
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
            <LiquidityPositionChart />
            <Br />
            <CorrelationChart />
          </div>
        </ContentContainer>

        <Credit />
      </BodyContainer>
    </ContextProvider>
  );
}

export default App;

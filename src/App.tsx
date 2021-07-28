import React from "react";
import styled from "styled-components";
import { Br } from "./common/atomic";
import CorrelationChart from "./containers/CorrelationChart";
import Credit from "./containers/Credit";
import EstimatedFees from "./containers/EstimatedFees";
import Header from "./containers/Header";
import Navbar from "./containers/Navbar";
import SelectPairModal from "./containers/select-pair/SelectPairModal";
import Setting from "./containers/setting/Setting";
import { AppContextProvider } from "./context/app/appContext";
import { ModalContextProvider } from "./context/modal/modalContext";

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
    <AppContextProvider>
      <ModalContextProvider>
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
              <CorrelationChart />
            </div>
          </ContentContainer>

          <Credit />
        </BodyContainer>
      </ModalContextProvider>
    </AppContextProvider>
  );
}

export default App;

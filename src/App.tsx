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
// import { useModalContext } from "./context/modal/modalContext";
// import AnnoucementModal from "./containers/AnnoucementModal";
// import { ModalActionType } from "./context/modal/modalReducer";

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
  // const { state, dispatch } = useModalContext();

  // useEffect(() => {
  //   if (localStorage.getItem("metamask-phishing-detection") === "OK") return;

  //   dispatch({
  //     type: ModalActionType.SET_ANNOUCEMENT_MODAL_STATE,
  //     payload: true,
  //   });
  // }, []);

  return (
    <>
      <SelectPairModal />
      {/* <AnnoucementModal /> */}
      {/* <DonateModal /> */}
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
    </>
  );
}

export default App;

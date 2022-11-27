import React from "react";
import styled from "styled-components";
import { Br } from "../common/components/atomic";
import CorrelationChart from "../containers/CorrelationChart";
import Footer from "../containers/Footer";
import EstimatedFees from "../containers/EstimatedFees";
import Header from "../containers/Header";
import Navbar from "../containers/navbar/Navbar";
import LiquidityPositionChart from "../containers/LiquidityPositionChart";
import SelectPairModal from "../containers/select-pair/SelectPairModal";
import Setting from "../containers/setting/Setting";
import { ScreenWidth } from "../utils/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FeedbackButton } from "../common/components/atomic";
import { useAppContext } from "../context/app/appContext";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { getCurrentNetwork } from "../common/network";
import ImpermanentLossModal from "../containers/ImpermanentLossModal";
// import { useModalContext } from "./context/modal/modalContext";
// import AnnoucementModal from "./containers/AnnoucementModal";
// import { ModalActionType } from "./context/modal/modalReducer";

const BodyContainer = styled.div`
  max-width: 900px;
  margin: auto;
  padding-top: 100px;

  @media only screen and (max-width: ${ScreenWidth.TABLET}px) {
    margin: auto 15px;
    padding-top: 85px;
  }
`;
const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 5fr 7fr;
  grid-gap: 25px;
  margin-top: 25px;

  @media only screen and (max-width: 820px) {
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }
`;

function App() {
  const { state } = useAppContext();
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
      <ImpermanentLossModal />
      {/* <AnnoucementModal /> */}
      {/* <DonateModal /> */}

      <FeedbackButton
        onClick={() => {
          const app_context = {
            token0: state.token0?.id,
            token1: state.token1?.id,
            chain: getCurrentNetwork().id,
            pool: state.pool?.id,
            depositAmount: state.depositAmountValue,
            priceRange: state.priceRangeValue,
            mostActivePrice: state.priceAssumptionValue,
          };
          if (process.env.NODE_ENV === "development") {
            return console.log({ app_context });
          }
          window.freddyWidget.setOptions({
            custom_fields: {
              app_context: JSON.stringify(app_context),
            },
          });
          window.freddyWidget.show();
        }}
      >
        <FontAwesomeIcon icon={faBug} />
      </FeedbackButton>

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

        <Footer />
      </BodyContainer>
    </>
  );
}

export default App;

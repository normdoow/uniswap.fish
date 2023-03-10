import React from "react";
import styled from "styled-components";
import { Br, H2 } from "../common/components/atomic";
import CorrelationChart from "../containers/CorrelationChart";
import Footer from "../containers/Footer";
import EstimatedFees from "../containers/EstimatedFees";
import Header from "../containers/Header";
import Navbar from "../containers/navbar/Navbar";
import LiquidityPositionChart from "../containers/LiquidityPositionChart";
import SelectPairModal, {
  SelectPair,
} from "../containers/select-pair/SelectPairModal";
import Setting from "../containers/setting/Setting";
import { ScreenWidth } from "../utils/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FeedbackButton } from "../common/components/atomic";
import { useAppContext } from "../context/app/appContext";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { getCurrentNetwork } from "../common/network";
import ImpermanentLossModal from "../containers/ImpermanentLossModal";
import CreatePositionModal from "../containers/CreatePositionModal";
import TopPosition from "../containers/TopPosition";

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
const LandingContainer = styled.div`
  max-width: 750px;
  margin: auto;
  padding-top: 80px;

  display: grid;
  grid-template-columns: 5fr 370px;
  grid-gap: 25px;
  margin-top: 25px;

  & > .select-pair {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    position: relative;
  }

  @media only screen and (max-width: ${ScreenWidth.TABLET}px) {
    margin: auto 15px;
    padding-top: 85px;
  }
`;
const Landing = styled.div`
  & p {
    color: #999;
  }
`;

function App() {
  const { state } = useAppContext();

  return (
    <>
      <SelectPairModal />
      <ImpermanentLossModal />
      <CreatePositionModal />

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

      {!state.pool && (
        <LandingContainer>
          <Landing>
            <H2>Welcome to Uniswap.fish</H2>
            <p>
              Uniswap.fish is an all-in-one workspace for Uniswap liquidity
              providers — calculate, discover, analyze, manage & track
              positions, and more.
            </p>
          </Landing>
          <div className="select-pair">
            <SelectPair />
          </div>
        </LandingContainer>
      )}

      {state.pool && (
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

          <Br />
          <TopPosition />
        </BodyContainer>
      )}

      <Footer />
    </>
  );
}

export default App;
export { Head } from "../common/components/Head";

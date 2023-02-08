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
import { Script } from "gatsby";
import CreatePositionModal from "../containers/CreatePositionModal";
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

export function Head() {
  return (
    <>
      <title>Uniswap V3 Fee Calculator - Uniswap.fish</title>
      <meta charSet="utf-8" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Gowun+Batang&family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <meta
        name="description"
        content="Calculate your Uniswap v3 positions fee returns, APY, APR, ROI, yields, and impermanent loss based on how much pool liquidity you provide."
      />
      <meta name="author" content="Chun Rapeepat" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Uniswap V3 Fee Calculator - Uniswap.fish"
      />
      <meta
        property="og:description"
        content="Calculate your Uniswap v3 positions fee returns, APY, APR, ROI, yields, and impermanent loss based on how much pool liquidity you provide."
      />
      <meta property="og:url" content="https://uniswap.fish" />
      <meta property="og:image" content="https://uniswap.fish/ogimage.jpeg" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@uniswapdotfish" />
      <meta
        name="twitter:title"
        content="Uniswap V3 Fee Calculator - Uniswap.fish"
      />
      <meta
        name="twitter:description"
        content="Calculate your Uniswap v3 positions fee returns, APY, APR, ROI, yields, and impermanent loss based on how much pool liquidity you provide."
      />
      <meta name="twitter:image" content="https://uniswap.fish/ogimage.jpeg" />
      <Script>
        {`var ffWidgetId = "bbf56663-84dc-4b55-bf9c-333b5b4c2720";
    var ffWidgetScript = document.createElement("script");
    ffWidgetScript.type = "text/javascript";
    ffWidgetScript.src = "https://freddyfeedback.com/widget/freddyfeedback.js";
    document.head.appendChild(ffWidgetScript);`}
      </Script>
    </>
  );
}

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
      <CreatePositionModal />
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

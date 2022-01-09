import React from "react";
import styled from "styled-components";
import { useWindowWidth } from "@react-hook/window-size";
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
import { PrimaryBlockButton } from "./common/buttons";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import DonateModal from "./containers/DonateModal";
import { useAppContext } from "./context/app/appContext";

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
const MobileNotSupportScreen = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 15px;
  text-align: center;

  color: white;

  & > h1 {
    margin: 0;
    font-size: 1.2rem;
  }
  & > p {
    color: #ccc;
    font-size: 1rem;
  }
`;
const EnterSite = styled.div`
  margin-top: 15px;
  width: calc(100vw - 30px);
`;
const Unicorn = styled.div`
  font-size: 5rem;
`;
const IconBar = styled.div`
  font-size: 1.2rem;
  margin-top: 30px;

  & > a {
    color: #777;
    margin: 0 10px;
  }
`;

function App() {
  const screenWidth = useWindowWidth();
  const [isEnter, setIsEnter] = useState(false);

  return (
    <ContextProvider>
      {!isEnter && screenWidth <= 960 && (
        <MobileNotSupportScreen>
          <Unicorn>🦄</Unicorn>
          <h1>Welcome to UniswapCalculator</h1>
          <p>
            Hi 🖐 Welcome to UniswapCalculator! I just want to tell you that
            this site doesn't support mobile devices yet. for a better
            experience, please visit on your desktop
          </p>
          <EnterSite>
            <PrimaryBlockButton onClick={() => setIsEnter(true)}>
              I understand, let's enter the site!
            </PrimaryBlockButton>
          </EnterSite>
          <IconBar>
            <a
              href="https://twitter.com/chunza2542"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              href="https://github.com/chunza2542/uniswapv3-calculator"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="mailto:hello@thechun.dev">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </IconBar>
        </MobileNotSupportScreen>
      )}
      {(isEnter || screenWidth > 960) && (
        <>
          <SelectPairModal />
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
      )}
    </ContextProvider>
  );
}

export default App;

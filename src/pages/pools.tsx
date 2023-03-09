import React from "react";
import styled from "styled-components";
import Footer from "../containers/Footer";
import Header from "../containers/Header";
import Navbar from "../containers/navbar/Navbar";
import { ScreenWidth } from "../utils/styled";
import { useAppContext } from "../context/app/appContext";
import { Br, Heading } from "../common/components/atomic";
import FavoritePools from "../containers/pools/FavoritePools";
import TopPools from "../containers/pools/TopPools";

const BodyContainer = styled.div`
  max-width: 900px;
  margin: auto;
  padding-top: 100px;

  @media only screen and (max-width: ${ScreenWidth.TABLET}px) {
    margin: auto 15px;
    padding-top: 85px;
  }
`;
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  & h2 {
    font-size: 1.2rem;
    margin: 0;
  }
`;

function App() {
  const { state } = useAppContext();

  return (
    <>
      <Navbar />
      <BodyContainer>
        <HeaderContainer>
          <h2>Pool Overview</h2>
        </HeaderContainer>

        <FavoritePools />
        <Br />
        <TopPools />

        <Footer />
      </BodyContainer>
    </>
  );
}

export default App;
export { Head } from "../common/components/Head";

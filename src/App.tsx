import React from "react";
import styled from "styled-components";
import Header from "./containers/Header";
import Navbar from "./containers/Navbar";
import Setting from "./containers/setting/Setting";

const BodyContainer = styled.div`
  width: 900px;
  margin: auto auto;
  padding-top: 100px;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 5fr 7fr;
  grid-gap: 30px;
  margin-top: 20px;
`;

function App() {
  return (
    <>
      <Navbar />
      <BodyContainer>
        <Header />
        <ContentContainer>
          <Setting />
          <div>TODO</div>
        </ContentContainer>
      </BodyContainer>
    </>
  );
}

export default App;

import React from "react";
import styled from "styled-components";
import Header from "./containers/Header";
import Navbar from "./containers/Navbar";

const Container = styled.div`
  width: 900px;
  margin: auto auto;
  padding-top: 100px;
`;

function App() {
  return (
    <>
      <Navbar />
      <Container>
        <Header />
      </Container>
    </>
  );
}

export default App;

import React from "react";
import styled from "styled-components";
import Header from "./containers/Header";

const Container = styled.div`
  width: 900px;
  margin: auto auto;
`;

function App() {
  return (
    <>
      <Header />
      <Container></Container>
    </>
  );
}

export default App;

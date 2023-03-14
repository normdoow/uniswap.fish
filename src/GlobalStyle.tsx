import { createGlobalStyle } from "@nfront/global-styles";

const GlobalStyle = createGlobalStyle`
  html {
    background: black;
  }
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-family: "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI",
      "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100vw;
    min-height: 100vh;

    background: radial-gradient(
        circle closest-corner at -10% 60vh,
        rgba(40, 72, 122, 0.85),
        transparent
      ),
      radial-gradient(
        circle closest-corner at 110% 60vh,
        rgba(138, 41, 129, 0.7),
        transparent
      );
    background-attachment: fixed;
  }
  @media only screen and (max-width: 930px) {
    body {
      background: radial-gradient(
          circle closest-corner at -20% 60vh,
          rgba(40, 72, 122, 0.85),
          transparent
        ),
        radial-gradient(
          circle closest-corner at 135% 60vh,
          rgba(138, 41, 129, 0.7),
          transparent
        );
      background-attachment: fixed;
    }
  }
  @media only screen and (max-width: 576px) {
    body {
      background: radial-gradient(
          circle closest-corner at -120% 60vh,
          rgba(40, 72, 122, 0.85),
          transparent
        ),
        radial-gradient(
          circle closest-corner at 240% 60vh,
          rgba(138, 41, 129, 0.7),
          transparent
        );
    }
  }

  /* Override CSS */
  .apexcharts-gridline {
    stroke-width: 1px;
    stroke: #333;
  }

  *[data-for="il"] {
    cursor: help;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  .thumb-red-0,
  .thumb-red-1 {
    background-color: rgb(247, 2, 119) !important;
  }
  .thumb-green-0,
  .thumb-green-1 {
    background-color: rgba(37, 175, 96, 1) !important;
  }
  .thumb-yellow-0,
  .thumb-yellow-1 {
    background-color: #fccc5d !important;
  }
`;

export default GlobalStyle;

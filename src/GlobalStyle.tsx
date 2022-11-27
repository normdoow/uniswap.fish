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
`;

export default GlobalStyle;

import React from "react";
import ReactDOM from "react-dom";
import { Metric } from "web-vitals";
import App from "./App";
import ContextProvider from "./context/ContextProvider";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

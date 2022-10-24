import React from "react";
import ReactDOM from "react-dom";
import { Metric } from "web-vitals";
import App from "./App";
import ContextProvider from "./context/ContextProvider";
import reportWebVitals from "./reportWebVitals";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
const LOG_WEB_VITALS = false;
const reportHandler = (metric: Metric) => {
  if (LOG_WEB_VITALS && process.env.NODE_ENV === "development") {
    console.log("web-vitals", metric);
  }
};

reportWebVitals(reportHandler);

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.unstable_AsyncMode>
    <App />
  </React.unstable_AsyncMode>,
  document.getElementById("root")
);

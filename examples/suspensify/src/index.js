import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Director } from "hitchcock";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Director>
    <App />
  </Director>
);

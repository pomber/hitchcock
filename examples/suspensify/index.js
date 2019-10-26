import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Director } from "hitchcock";
import "./index.scss";

const container = document.getElementById("root");
ReactDOM.createRoot(container).render(
  <Director>
    <App />
  </Director>
);

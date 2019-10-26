import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";
import { Director } from "hitchcock";

const container = document.getElementById("root");
ReactDOM.createRoot(container).render(
  <Director>
    <App />
  </Director>
);

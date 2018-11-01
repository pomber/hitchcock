import React from "react";
import { createRoot } from "react-dom";
import { Director } from "hitchcock";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <Director>
    <App />
  </Director>
);

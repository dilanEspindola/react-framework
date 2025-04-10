import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

import "./styles/global.css";

const app = document.getElementById("root");

const root = createRoot(app!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

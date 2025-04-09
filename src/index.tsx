import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./styles/global.css";

const app = document.getElementById("root");

if (app) {
  const root = createRoot(app);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

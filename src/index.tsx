import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { routes } from "./routes";
import Home from "./pages/home/page";

import "./styles/global.css";

const app = document.getElementById("root");

const root = createRoot(app!);
root.render(
  <StrictMode>
    <Home />
  </StrictMode>
);

// hydrateRoot(app!, <Home />);

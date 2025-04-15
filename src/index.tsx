import { lazy, StrictMode, Suspense } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { routes } from "./routes";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./report-error";

import "./styles/global.css";
import Route from "./components/router";

const app = document.getElementById("root");

const routeList = Object.values(routes).map((route) => {
  return {
    ...route,
    component: lazy(() => route.component()),
  };
});

const root = createRoot(app!);
root.render(
  <StrictMode>
    {routeList.map(({ component: Component, path }) => (
      <Route
        Component={() => (
          <Suspense fallback={<div>Loading...</div>}>
            <Component />
          </Suspense>
        )}
        path={path}
        key={path}
      />
    ))}
  </StrictMode>
);

// hydrateRoot(app!, <Home />, {
//   onCaughtError: onCaughtErrorProd,
//   onRecoverableError: onRecoverableErrorProd,
//   onUncaughtError: onUncaughtErrorProd,
// });

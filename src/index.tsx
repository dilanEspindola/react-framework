import { lazy, StrictMode, Suspense } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { routes } from "./routes";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./report-error";
import { Switch, Route } from "wouter";
import HomePage from "./pages/home/page";

import "./styles/global.css";

const app = document.getElementById("root");

const routeList = Object.values(routes).map((route) => {
  console.log("path", route.path);
  return {
    ...route,
    component: lazy(() => route.component()),
  };
});

const root = createRoot(app!);
root.render(
  <StrictMode>
    <Switch>
      <Suspense fallback={<div>Loading...</div>}>
        {routeList.map(({ component, path }) => (
          <Route component={component} path={path} key={path} />
        ))}
      </Suspense>
    </Switch>
  </StrictMode>
);
// root.render(
//   <StrictMode>
//     {routeList.map(({ component: Component, path }) => (
//       <Route
//         Component={() => (
//           <Suspense fallback={<div>Loading...</div>}>
//             <Component />
//           </Suspense>
//         )}
//         path={path}
//         key={path}
//       />
//     ))}
//   </StrictMode>
// );

// hydrateRoot(app!, <Home />, {
//   onCaughtError: onCaughtErrorProd,
//   onRecoverableError: onRecoverableErrorProd,
//   onUncaughtError: onUncaughtErrorProd,
// });

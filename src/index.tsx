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
import MainPage from "./pages/page";

import "./styles/global.css";

const app = document.getElementById("root");

const routeList = Object.values(routes).map((route) => {
  console.log("path", route.path);
  return {
    ...route,
    component: lazy(() => route.component()),
  };
});

// const root = createRoot(app!);
// root.render(
//   <StrictMode>
//     <Switch>
//       {routeList.map(({ component, path }) => (
//         <Route component={component} path={path} key={path} />
//       ))}
//     </Switch>
//   </StrictMode>
// );

// if (window.location.pathname === "/") {
//   const root = createRoot(app!);
//   root.render(
//     <StrictMode>
//       <Switch>
//         <Route path="/" component={MainPage} />
//       </Switch>
//     </StrictMode>
//   );
// } else {
//   hydrateRoot(
//     app!,
//     <StrictMode>
//       <Switch>
//         {routeList.map(({ component, path }) => (
//           <Route component={component} path={path} key={path} />
//         ))}
//       </Switch>
//     </StrictMode>,
//     {
//         onCaughtError: onCaughtErrorProd,
//         onRecoverableError: onRecoverableErrorProd,
//         onUncaughtError: onUncaughtErrorProd,
//     }
//   );
// }

hydrateRoot(
  app!,
  <StrictMode>
    <Switch>
      {routeList.map(({ component, path }) => (
        <Route component={component} path={path} key={path} />
      ))}
    </Switch>
  </StrictMode>,
  {
    onCaughtError: onCaughtErrorProd,
    onRecoverableError: onRecoverableErrorProd,
    onUncaughtError: onUncaughtErrorProd,
  }
);

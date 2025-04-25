import express from "express";
import path from "path";
import { cwd } from "process";
import { routes } from "../src/routes";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { Router } from "wouter";
import React from "react";
import { RspackDevServer } from "@rspack/dev-server";
import rspack from "@rspack/core";
import rspackConfig from "../rspack.config.mjs";
import type { RspackDevServerOptions } from "@rspack/cli";
import { watch, readdirSync, writeFile, readFileSync, existsSync } from "fs";
interface RoutePropierties {
  filePath: string;
  isSSR: boolean;
  path: string;
}
const app = express();

console.log(process.cwd());

// const isDev = process.env.NODE_ENV === "development";
const isDev = "development";
const PORT = 4000;
const filesPath = path.join(path.resolve(), "dev");
const assets = path.join(process.cwd(), "public");

const compiler = rspack(rspackConfig);
const devServerOptions: RspackDevServerOptions = {
  ...rspackConfig.devServer,
  setupMiddlewares: (middlewares, _devServer) => {
    const pagesDir = path.resolve("src/pages");
    const routeMap = new Map();

    const generateRouteFile = () => {
      const readAllFiles = (pagesDir: string) => {
        const content = readdirSync(pagesDir, { encoding: "utf-8" });

        content.forEach((element) => {
          const pathEl = path.join(pagesDir, element);
          if (pathEl.includes("page.tsx")) {
            const url = pathEl.split("src")[1];
            const filePath = path.join("./src", url.replace(/\\/g, "/"));
            const fileContent = readFileSync(`${cwd()}/${filePath}`, {
              encoding: "utf-8",
            });
            const keyDirPath = url
              .split("pages")[1]
              .split("page.tsx")[0]
              .replace(/\\/g, "/");

            routeMap.set(keyDirPath, {
              filePath: filePath.replace(/\\/g, "/"),
              isSSR: fileContent.includes("use ssr"),
              path:
                keyDirPath === "/"
                  ? "/"
                  : keyDirPath.replace(/(?:^\/+)|(?:\/+$)/g, ""),
              component: `() => import("${filePath}")`,
            });
          } else {
            readAllFiles(pathEl);
          }
        });
      };
      readAllFiles(pagesDir);

      const jsObject = `export const routes = {
              ${Array.from(routeMap.entries())
                .map(([path, config]) => {
                  return `"${path}": {
                    filePath: "${config.filePath}",
                    isSSR: ${config.isSSR},
                    path: "${config.path}",
                    component: () => import("${config.filePath.replace(
                      /^src\//,
                      "./"
                    )}")
                  }`;
                })
                .join(",\n")}
          };`;

      const routesFile = path.join(path.resolve(), "src/routes.ts");
      const currentContent = existsSync(pagesDir)
        ? readFileSync(routesFile, { encoding: "utf-8" })
        : "";

      if (currentContent !== jsObject) {
        writeFile(routesFile, jsObject, (err) => {
          if (err) throw new Error("Error writing file: " + err);
          console.log("file written successfully");
        });
      }
    };

    generateRouteFile();

    watch(pagesDir, { recursive: true }, (evenType, filename) => {
      console.log(`File ${filename} was ${evenType}`);
      generateRouteFile();
    });

    _devServer.app?.use(app);
    // _devServer.app?.use(express.static(path.join(assets)));

    return middlewares;
  },
};

const server = new RspackDevServer(devServerOptions, compiler);

app.use(express.static(assets));

const routesKeys = Object.keys(routes);

function parseUrl(key: string): string {
  if (key.includes("[")) {
    const keyParsed = key.replace(/\[(\w+)\]/g, ":$1");
    return keyParsed;
  }
  return key;
}

for (let key of routesKeys) {
  const route: RoutePropierties = routes[key];
  const scriptFilename = isDev ? "/main.js" : "/main.js";

  const keyParsed = parseUrl(key);

  app.get(keyParsed, async (req, res) => {
    const componentModule = await import(`${path.resolve()}/${route.filePath}`);
    const Component = componentModule.default;

    const htmlComponent = renderToString(
      <Router ssrPath={keyParsed}>
        <Component />
      </Router>
    );

    const htmlFile = path.join(filesPath, "index.html");

    const fileContent = readFileSync(htmlFile, "utf-8");
    const htmlUpdated = fileContent.replace(
      '<div id="root"></div>',
      `<div id="root">${htmlComponent}</div>`
    );

    res.send(htmlUpdated);
  });
}

server
  .start()
  .then(() => {
    console.log(`Server is running on port ${PORT}`);
  })
  .catch((err) => {
    console.log("oops", err);
  });

// app.listen(PORT, () => {
//   console.log(`\nServer is running on port ${PORT}`);
// });

// if (route.isSSR) {
//   const componentModule = await import(`${path.resolve()}/${route.filePath}`);

//   const Component = componentModule.default;

//   const html = renderToString(React.createElement(Component));

//   const mainHtml = `
//       <!DOCTYPE html>
//       <html lang="en">
//         <head>
//           <meta charset="UTF-8" />
//           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//           <title>Document</title>
//         </head>
//         <body>
//           <div id="root">${html}</div>
//           <script>window.__SSR__ = true;</script>
//           <script src="${scriptFilename}"></script>
//         </body>
//       </html>
//       `;

//   return res.send(mainHtml);
// }

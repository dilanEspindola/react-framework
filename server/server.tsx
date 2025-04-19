import express from "express";
import path from "path";
import { cwd } from "process";
import { routes } from "../src/routes";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { Router } from "wouter";
import React from "react";
import { read, readFileSync } from "fs";

interface RoutePropierties {
  filePath: string;
  isSSR: boolean;
  path: string;
}

// console.log(process.env.NODE_ENV);

// const isDev = process.env.NODE_ENV === "development";
const isDev = "development";
const app = express();
const PORT = 4000;

app.use(express.static(path.join(path.resolve(), "dev")));

const filesPath = path.join(path.resolve(), "dev");

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
    if (route.isSSR) {
      const componentModule = await import(
        `${path.resolve()}/${route.filePath}`
      );

      const Component = componentModule.default;

      const html = renderToString(React.createElement(Component));

      const mainHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <div id="root">${html}</div>
          <script>window.__SSR__ = true;</script>
          <script src="${scriptFilename}"></script>
        </body>
      </html>
      `;

      return res.send(mainHtml);
    }

    // console.log("path", route.filePath);
    // console.log("keyParsed", keyParsed);

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

app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
});

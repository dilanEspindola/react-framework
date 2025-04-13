import express from "express";
import path from "path";
import { cwd } from "process";
import { routes } from "../src/routes";
import { renderToString } from "react-dom/server";
import React, { Component } from "react";

interface RoutePropierties {
  filePath: string;
  isSSR: boolean;
}

const isDev = "development";
const app = express();
const PORT = 4000;

app.use(express.static(path.join(cwd(), "dev")));

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

  if (route.isSSR) {
    const keyParsed = parseUrl(key);
    app.get(keyParsed, async (req, res) => {
      const componentModule = await import(`${cwd()}/${route.filePath}`);
      console.log(componentModule.default());

      const html = renderToString(componentModule.default());

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

      res.send(mainHtml);
    });
  }
}

app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
});

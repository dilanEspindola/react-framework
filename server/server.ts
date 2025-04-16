import express from "express";
import path from "path";
import { cwd } from "process";
import { routes } from "../src/routes";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import React from "react";

interface RoutePropierties {
  filePath: string;
  isSSR: boolean;
}

const isDev = process.env.NODE_ENV === "development";
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

  app.use(keyParsed, async (req, res) => {
    if (route.isSSR) {
      const componentModule = await import(
        `${path.resolve()}/${route.filePath}`
      );
      console.log(componentModule.default());

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

    const htmlFile = path.join(filesPath, "index.html");
    res.sendFile(htmlFile);
  });
}

app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
});

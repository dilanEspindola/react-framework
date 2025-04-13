import express from "express";
import path from "path";
import { cwd } from "process";
import { routes } from "../src/routes";
import { checkSSRRoutes } from "./ssr";

interface IRoutes {
  [key: string]: Record<string, string>;
}

const app = express();
const PORT = 4000;

app.use(express.static(path.join(cwd(), "dist")));

const routesKeys = Object.keys(routes);

for (let key of routesKeys) {
  const route = routes[key];

  if (route.isSSR) {
    if (key.includes("[")) {
      const keyParsed = key.replace(/\[(\w+)\]/g, ":$1");
      app.get(keyParsed, (req, res) => {
        res.send(`hellos ${req.params.postId}`);
      });
    } else {
      app.get(key, (req, res) => {
        res.send(`hellos ${key}`);
      });
    }
  }
}

app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
});

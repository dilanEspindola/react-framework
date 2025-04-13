import express from "express";
import { read, readdir, readFile } from "fs";
import path from "path";
import { cwd } from "process";
import { routes } from "../src/routes";

interface SsrRoute {
  path?: string;
  isSSR?: boolean;
}
interface IRoutes {
  [key: string]: string;
}

export function checkSSRRoutes(routes: IRoutes): Promise<SsrRoute[]>[] {
  let ssrRoutes: Array<SsrRoute> = [];
  let promises: Array<Promise<SsrRoute[]>> = [];
  Object.values(routes).forEach((route) => {
    const promise = new Promise<SsrRoute[]>((resolve, reject) => {
      readFile(
        `${cwd()}/${route}`,
        { encoding: "utf-8" },
        (err, fileContent) => {
          if (err) {
            reject("Error reading file: " + err);
            return;
          }

          if (fileContent.includes("use ssr")) {
            ssrRoutes.push({
              path: route,
              isSSR: true,
            });
          } else {
            ssrRoutes.push({
              path: route,
              isSSR: false,
            });
          }
          resolve(ssrRoutes);
        }
      );
    });

    promises.push(promise);
  });

  return promises;
}

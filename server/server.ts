import express from "express";
import { readdir, readFile } from "fs";
import path from "path";
import { cwd } from "process";
import { routes } from "../src/routes";

const app = express();
const PORT = 4000;

const homePage = await import("../src/pages/home/page.tsx");

app.get("/pages", (req, res) => {
  res.json({ message: "pages" });
});

app.get("/pages/home", (req, res) => {
  res.json({ message: "pages" });
});

app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
});

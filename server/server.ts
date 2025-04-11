import express from "express";
import { readdir, readFile } from "fs";
import path from "path";
import { cwd } from "process";

const app = express();
const PORT = 4000;

const pagesDIr = cwd() + "/src/pages";

function getPages() {}

const pages = path.resolve(pagesDIr);

readdir(pages, (err, pages) => {
  if (err) {
    console.log(err);
  }
  console.log(pages);
});

app.get("/pages", (req, res) => {
  res.json({ message: "pages" });
});

app.get("/pages/home", (req, res) => {
  res.json({ message: "pages" });
});

app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
});

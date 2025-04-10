import express from "express";
import { cwd } from "process";

const app = express();
const PORT = 4000;

console.log(cwd());

app.get("/pages", (req, res) => {
  res.json({ message: "pages" });
});

app.get("/pages/home", (req, res) => {
  res.json({ message: "pages" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

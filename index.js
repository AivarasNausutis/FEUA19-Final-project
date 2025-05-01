import express from "express";
import "dotenv/config";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`This app was started on port: ${process.env.port}`);
});

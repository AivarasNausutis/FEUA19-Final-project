import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import ticketsRouter from "./src/routes/tickets.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.mongo)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log(err);
  });

app.use(ticketsRouter);

app.use((req, res) => {
  return res.status(404).json({ message: "This endpoint does not exist" });
});

app.listen(process.env.port, () => {
  console.log(`This app is running on port: ${process.env.port}`);
});

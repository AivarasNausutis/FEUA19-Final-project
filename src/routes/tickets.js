import express from "express";
import { INSERT_TICKET } from "../controllers/tickets.js";

const router = express.Router();

router.post("/insert_ticket", INSERT_TICKET);

export default router;

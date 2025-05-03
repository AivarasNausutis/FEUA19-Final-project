import express from "express";
import { INSERT_TICKET, BUY_TICKET } from "../controllers/tickets.js";

const router = express.Router();
import validate from "../middleware/validation.js";
import createTicketSchema from "../schemas/tickets.js";
import auth from "../middleware/auth.js";

router.post(
  "/insert_ticket",
  auth,
  validate(createTicketSchema),
  INSERT_TICKET
);
router.post("/buyTicket", auth, BUY_TICKET);

export default router;

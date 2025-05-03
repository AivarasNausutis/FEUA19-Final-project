import { v4 as uuidv4 } from "uuid";
import ticketModel from "../models/tickets.js";
import UserModel from "../models/users.js";

const INSERT_TICKET = async (req, res) => {
  try {
    const ticket = new ticketModel({
      id: uuidv4(),
      title: req.body.title,
      ticket_price: req.body.ticket_price,
      from_location: req.body.from_location,
      to_location: req.body.to_location,
      to_location_photo_url: req.body.to_location_photo_url,
      userId: req.body.userId,
    });

    const response = await ticket.save();

    return res.status(201).json({
      ticket: response,
    });
  } catch (err) {
    console.log("We are having some technical difficulties");
    console.log(err);

    return res.status(400).json({
      message: "We are having some technical difficulties",
    });
  }
};

const BUY_TICKET = async (req, res) => {
  const { user_id, ticket_id } = req.body;

  if (!user_id || !ticket_id) {
    return res.status(400).json({ message: "Missing user_id or ticket_id" });
  }

  try {
    const user = await UserModel.findById(user_id);
    const ticket = await ticketModel.findById(ticket_id);

    if (!user || !ticket) {
      return res.status(404).json({ message: "User or ticket not found" });
    }

    if (user.money_balance < ticket.ticket_price) {
      return res
        .status(400)
        .json({ message: "Insufficient funds to buy the ticket" });
    }

    user.money_balance -= ticket.ticket_price;
    user.bought_tickets.push(ticket._id);

    await user.save();

    res.status(200).json({
      message: "Ticket purchased successfully",
      user: {
        id: user._id,
        new_balance: user.money_balance,
        bought_tickets: user.bought_tickets,
      },
    });
  } catch (error) {
    console.error("Error in /buyTicket:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export { INSERT_TICKET, BUY_TICKET };

import { v4 as uuidv4 } from "uuid";
import ticketModel from "../models/tickets.js";

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

export { INSERT_TICKET };

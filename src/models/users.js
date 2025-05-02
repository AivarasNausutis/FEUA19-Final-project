import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bought_tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "ticket" }],
  money_balance: { type: Number, required: false },
});

export default mongoose.model("user", userSchema);

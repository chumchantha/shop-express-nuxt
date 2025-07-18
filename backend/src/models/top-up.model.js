import mongoose from "mongoose";

const topUpSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  md5: {
    type: String,
    required: true,
    unique: true,
  },
  qr: {
    type: String,
    required: true,
    unique: true,
  },
  expectedAmount: {
    type: Number,
    min: [0, "Amount must be positive!"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
});

export const TopUp = mongoose.model("TopUp", topUpSchema);

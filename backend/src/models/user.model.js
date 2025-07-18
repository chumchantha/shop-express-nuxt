import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, "Balance must be positive!"],
  },
});

export const User = mongoose.model("User", userSchema);

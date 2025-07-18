import { Router } from "express";
import { generateKhQr } from "../bakong/khqr.js";
import { checkAuth } from "../middleware/auth.js";
import { TopUp } from "../models/top-up.model.js";
import axios from "axios";
import { User } from "../models/user.model.js";

export const topUpRoute = Router();

topUpRoute.post("/", checkAuth, async (req, res) => {
  const { id } = req.user;
  const { amount } = req.body;
  if (!amount) {
    res.status(400).json({
      success: false,
      message: "Amount is required!",
      data: null,
    });
  }

  try {
    //generate dynamic khqr
    const { data } = await generateKhQr(amount);

    //Save to db
    const topUp = new TopUp({
      userId: id,
      md5: data.md5,
      qr: data.qr,
      expectedAmount: amount,
    });
    await topUp.save();

    return res.status(201).json({
      success: true,
      message: "Generate khqr successfully.",
      data: data,
    });
  } catch (err) {
    const errorMsg = err || "Failed to create QR!";
    return res
      .status(500)
      .json({ success: false, message: errorMsg, data: null });
  }
});

topUpRoute.get("/verify/:md5", async (req, res) => {
  const { md5 } = req.params;

  try {
    //fins md5 in TopUp db
    const topUp = await TopUp.findOne({ md5 });
    if (!topUp) return res.status(404).json({ error: "Top-up not found" });

    //verify from bakong api
    const bakong = await axios.post(
      "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5",
      { md5 },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMTlkYzg5N2EyNzJmNGM3MSJ9LCJpYXQiOjE3NTIzOTI3NTgsImV4cCI6MTc2MDE2ODc1OH0.jbWlkMQL_x8hIO0kgZSBP1lx6UCTGuXQM_M20mQzkeE",
        },
      }
    );

    const verifyRes = await bakong.data;
    // console.log(verifyRes);

    //check if verify bakong api success code=0, false code=1 && user amount >= topUp input
    if (
      verifyRes.responseCode === 0 &&
      verifyRes.data.amount >= topUp.expectedAmount
    ) {
      topUp.status = "completed";
      await topUp.save();

      await User.findByIdAndUpdate(topUp.userId, {
        $inc: { balance: verifyRes.data.amount },
      });

      return res.json({ success: true, amount: verifyRes.data.amount });
    }

    return res.status(202).json({
      success: false,
      status: "pending",
      reason: "Waiting for match or amount too low",
      topUp,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Verification failed" });
  }
});

import { Router } from "express";
import { User } from "../models/user.model.js";
import {
  compareHash,
  createToken,
  decodeToken,
  hashed,
} from "../utils/token.js";
import {
  checkAuth,
  checkToken,
  onlyAdmin,
  validateUser,
} from "../middleware/auth.js";

export const authRoute = Router();

authRoute.post("/register", validateUser, async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await hashed(password);

  try {
    const user = await User.create({ username, password: hashedPassword });
    return res.status(201).json({ msg: "Created successfully.", user: user });
  } catch (error) {
    return res.status(400).json({
      msg: "Username is ready exist!",
    });
  }
});

authRoute.post("/login", validateUser, async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ msg: "Invalid Credentials!" });
  }

  const matchPassword = await compareHash(password, user.password);
  if (!matchPassword)
    return res.status(401).json({
      msg: "Invalid Credentials!",
    });

  const token = await createToken(user);

  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "lax",
    })
    .json({ msg: "Login successfully.", user: user });
});

authRoute.get("/me", checkToken, async (req, res) => {
  try {
    const token = req.cookies.access_token;
    const { id } = await decodeToken(token);

    const user = await User.findById(id);

    return res.json({ user });
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid Token!",
    });
  }
});

//Logout
authRoute.post("/logout", checkToken, (req, res) => {
  res.clearCookie("access_token");
  return res.json({ msg: "Logged out successfully." });
});

authRoute.get("/admin", checkAuth, onlyAdmin, (req, res) => {
  return res.json({ msg: "Hi admin" });
});

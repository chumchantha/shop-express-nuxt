import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/dotenv.js";
import { decodeToken } from "../utils/token.js";

export const validateUser = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      msg: "Missing fields!",
    });
  }
  next();
};

export const onlyAdmin = async (req, res, next) => {
  const token = req.cookies.access_token;

  const { role } = await decodeToken(token);

  if (role !== "admin") {
    return res.status(403).json({
      msg: "Sorry Only Admin can access!",
    });
  }
  next();
};

export const checkToken = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      msg: "No Token!",
    });
  }

  next();
};

export const checkAuth = async (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ msg: "Please Login!" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 👈 store user in req.user

    next();
  } catch (err) {
    return res.status(403).json({ msg: "Invalid or expired token!" });
  }
};

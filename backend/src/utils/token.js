import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/dotenv.js";
import bcrypt from "bcryptjs";

// In-memory storage for Bakong API token (in production, use Redis or database)
let bakongToken = null;

export function hashed(value) {
  return bcrypt.hash(value, 12);
}

export function compareHash(value, hashedValue) {
  return bcrypt.compare(value, hashedValue);
}

export function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function decodeToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Bakong token management functions
export function setToken(token) {
  bakongToken = token;
}

export function getToken() {
  return bakongToken;
}

export function hasToken() {
  return bakongToken !== null;
}

export function getTokenInfo() {
  return {
    hasToken: hasToken(),
    tokenLength: bakongToken ? bakongToken.length : 0,
  };
}

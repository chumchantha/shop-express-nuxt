import { config } from "dotenv";

config();

export const { MONGODB_URI, JWT_SECRET, BAKONG_BASE_URL, BAKONG_API_TOKEN } =
  process.env;

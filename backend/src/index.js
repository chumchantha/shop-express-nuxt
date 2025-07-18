import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./configs/db.js";
import { authRoute } from "./routes/auth.route.js";
import { topUpRoute } from "./routes/top-up.route.js";

const app = express();

await connectDB();

app.use(
  cors({
    origin: "http://localhost:3000", // Nuxt frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.listen(8080, () => {
  return console.log("Server Running http://localhost:8080");
});

app.use("/auth", authRoute);
app.use("/top-up", topUpRoute);

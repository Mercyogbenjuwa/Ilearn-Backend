import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";

import usersRouter from "./routes/usersroute";

import { connectDB } from "./Config/index";
import dotenv from "dotenv";
dotenv.config();

// this calls the database connection
connectDB();

const app = express();

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

//routes
app.use("/users", usersRouter);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";

import usersRouter from "./routes/usersRoutes";
import coursesRouter from "./routes/coursesRoutes";
import cors from "cors";
import { connectDB } from "./Config/index";
import dotenv from "dotenv";
import {
  appError,
  errorHandler,
  notFound,
} from "./Middlewares/errorMiddleware";
dotenv.config();

// this calls the database connection
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

//routes
app.use("/users", usersRouter);
app.use("/courses", coursesRouter);

app.get("/", (req, res) => {
  res.status(200).send("api is running");
});
// not found error handler
app.use(notFound);

// error handler
app.use(errorHandler);
// app.use(appError);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

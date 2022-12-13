import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./Config/index";
import dotenv from "dotenv";
import {swaggerDoc} from './utils'
dotenv.config();

// this calls the database connection
connectDB();

const app = express();

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

const port = 4000;
swaggerDoc(app)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;

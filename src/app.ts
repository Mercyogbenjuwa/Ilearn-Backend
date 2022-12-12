import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { db } from "./Config/index";

import * as dotenv from "dotenv";
dotenv.config();
const app = express();

//sequelize connection
db.sync({})
  .then(() => {
    console.log("Db connected successfuly");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

const port = 4000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;

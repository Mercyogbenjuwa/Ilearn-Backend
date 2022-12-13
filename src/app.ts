import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { db } from "./Config/index";
import usersRouter from './routes/usersroute';
import dotenv from "dotenv";
dotenv.config();


//sequelize connection
db.sync({})
  .then(() => {
    console.log("Db connected successfuly");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

app.use('/users', usersRouter);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

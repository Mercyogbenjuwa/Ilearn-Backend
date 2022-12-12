import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const db = new Sequelize("postgres", "postgres", "1234", {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false,
});

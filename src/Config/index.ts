import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize("postgres", "postgres", "root", {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false,
});

export const connectDB = async () => {
  try {
    await db.authenticate();
    await db.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

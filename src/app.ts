import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

const port = 4000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;

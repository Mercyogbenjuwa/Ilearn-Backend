import express, { Request, Response } from "express";
import { getAllUsers, Login, Register } from "../controller/userController";
import { protect } from "../Middlewares/authMiddleware";

const router = express.Router();

// router.get("/", (req: Request, res: Response) => {
//   return res.status(200).json({
//     message: "my landing page",
//   });
// });
router.post("/signup", Register);
router.post("/login", Login);
router.get("/", protect, getAllUsers);

export default router;

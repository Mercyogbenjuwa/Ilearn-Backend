import express from "express";
import {
  createReminder,
  forgotPassword,
  getAllUsers,
  getRecommendedCourses,
  Login,
  Register,
  resetPasswordGet,
  resetPasswordPost,
} from "../controller/userController";
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
router.post("/forgot-password", forgotPassword);
router.get("/resetpassword/:id/:token", resetPasswordGet);
router.post("/resetpassword/:id/:token", resetPasswordPost);
router.post("/reminders", protect, createReminder);
//router.post("/request", protect, requestTutor);
router.get('/recommended/:category', protect, getRecommendedCourses)

export default router;

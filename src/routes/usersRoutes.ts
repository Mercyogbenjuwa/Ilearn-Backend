import express, { Request, Response } from "express";
import { forgotPassword, getAllUsers, getTutorDetails, Login, Register, resetPasswordGet, resetPasswordPost, updateTutorProfile } from "../controller/userController";
import { protect } from "../Middlewares/authMiddleware";
import { upload } from "../utils/multer";

const router = express.Router();

// router.get("/", (req: Request, res: Response) => {
//   return res.status(200).json({
//     message: "my landing page",
//   });
// });
router.post("/signup", Register);
router.post("/login", Login);
router.get("/", protect, getAllUsers);
router.get("/atutordetail/:tutorid", protect, getTutorDetails);
router.put("/updatetutorprofile", protect, upload.single('image'), updateTutorProfile);
router.post('/forgot-password', forgotPassword);
router.get("/resetpassword/:id/:token", resetPasswordGet);
router.post("/resetpassword/:id/:token",resetPasswordPost);

export default router;

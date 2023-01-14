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
  getTutorDetails,
  updateTutorProfile,
  getAllTutors,
  tutorRating,
  verifyUser,
  getUserNotifications,
  readNotification,
  rateTutor,
} from "../controller/userController";
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
router.get("/verify/:signature", verifyUser);

/**
 * @swagger
 * /users:
 *   get:
 *     description: get all users!
 *     responses:
 *       200:
 *         description: Returns an array of users.
 */

router.get("/", getAllUsers);


router.get("/atutordetail/:tutorid", protect, getTutorDetails);

router.post("/tutors/:id/rate", protect, rateTutor)
router.put(
  "/updatetutorprofile",
  protect,
  upload.single("image"),
  updateTutorProfile
);
router.post("/forgot-password", forgotPassword);
router.get("/resetpassword/:id/:token", resetPasswordGet);
router.post("/resetpassword/:id/:token", resetPasswordPost);
router.post("/reminders", protect, createReminder);
router.get("/all-tutors", getAllTutors);
router.get("/feature-tutors", tutorRating);
//router.post("/request", protect, requestTutor);
router.get("/recommended/:category", protect, getRecommendedCourses);
router.get("/notifications", protect, getUserNotifications);
router.put("/notifications/:id", protect, readNotification);
export default router;

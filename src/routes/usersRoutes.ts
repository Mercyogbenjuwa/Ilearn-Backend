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
  addAreaOfInterest,
  deleteAreaOfInterest,
  getAreaOfInterest,
  getUserProfile,
  editprofile,
  createAvailability,
  rateTutor
} from "../controller/userController";
import { protect } from "../Middlewares/authMiddleware";
import { upload } from "../utils/multer";

const router = express.Router();

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
router.get("/profile", protect, getUserProfile);
router.get("/atutordetail/:tutorid", protect, getTutorDetails);

router.post("/tutors/:id/rate", protect, rateTutor);
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
router.post(
  "/edit-profile/:signature",
  upload.single("imageUrl"),
  protect,
  editprofile
);
router.post("/add-area-of-interest", protect, addAreaOfInterest);
router.delete("/delete-area-of-interest/:id", protect, deleteAreaOfInterest);
router.get("/get-area-of-interest", protect, getAreaOfInterest);
router.post("/tutors/availablity", protect, createAvailability);
export default router;

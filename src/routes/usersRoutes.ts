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
  getTutorAvailabilities,
  getUserProfile,
  editprofile,
  createAvailability,
  getStudentCourses,
  createStudentCourse,
  updateCourseProgress,
  getTutorCourses,
  rateTutor,
  getTutorReviews,
  getStudentCourse,
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
router.get("/tutors/:id/review", getTutorReviews);
router.put(
  "/updatetutorprofile",
  protect,
  upload.single("image"),
  updateTutorProfile
);
router.post("/forgot-password", forgotPassword);
router.post("/tutors/:id/rate", protect, rateTutor)
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

// student course route
router
  .route("/students/courses")
  .get(protect, getStudentCourses)
  .post(protect, createStudentCourse)
  .patch(protect, updateCourseProgress);

  router.get( "/students/courses/:id",protect,  getStudentCourse)

router.get("/get-available-tutors/:tutorId", protect, getTutorAvailabilities);
router.get("/tutors/:id/course", protect, getTutorCourses);

export default router;

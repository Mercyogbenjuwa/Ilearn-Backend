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
  getTutorCourses,
  rateTutor,
  getTutorReviews,
} from "../controller/userController";
import { protect } from "../Middlewares/authMiddleware";
import { upload } from "../utils/multer";

const router = express.Router();
/**
 * @openapi
 * '/users/signup':
 *  post:
 *    tags: 
 *      - Auth
 *    summary: Register a user
 *    requestBody: 
 *      required: true
 *      content: 
 *        application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *    responses:
 *       201:
 *         description: you have sucessfully registered a user, check your email
 *         content: 
 *           application/json:
 *              schema:
 *                 $ref: '#/components/schemas/CreateUserResponse'
 *       500:
 *         description: internal server error
 * 
 */
router.post("/signup", Register);

/**
 * @openapi
 * '/users/login':
 *  post:
 *    tags: 
 *      - Auth
 *    summary: Login a user
 *    requestBody: 
 *      required: true
 *      content: 
 *        application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserInput'
 *    responses:
 *       201:
 *         description: you have sucessfully logged in
 *         content: 
 *           application/json:
 *              schema:
 *                 $ref: '#/components/schemas/LoginUserResponse'
 *       500:
 *         description: internal server error
 * 
 */
router.post("/login", Login);


router.get("/verify/:signature", verifyUser);

/**
 * @openapi
 * /users:
 *   get:
 *      tags: [Users]
 *      description: get all users!
 *      responses:
 *        200:
 *          description: Returns an array of users.
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
router.get("/resetpassword/:id/:token", resetPasswordGet);
router.post("/resetpassword/:id/:token", resetPasswordPost);
router.post("/reminders", protect, createReminder);

/**
 * @openapi
 * /users/all-tutors:
 *   get:
 *      tags: [Users]
 *      description: get all tutors!
 *      responses:
 *        200:
 *          description: Returns an array of users.
 */
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
router.get("/get-available-tutors/:tutorId", protect, getTutorAvailabilities);
router.get("/tutors/:id/course", protect, getTutorCourses);

export default router;

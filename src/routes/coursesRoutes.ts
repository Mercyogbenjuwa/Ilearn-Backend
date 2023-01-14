import express from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourse,
  updateCourse,
  addCourse,
  courseRequest,
  rateCourses,
, requestCourseById} from "../controller/courseController";
import { getAllUsers, Login, Register } from "../controller/userController";
import { protect } from "../Middlewares/authMiddleware";
import { getStudentHistory } from "../controller/courseController";
import { upload } from "../utils/multer";
const router = express.Router();

//router.post("/addCourse", protect, addCourse);
router.get("/", getAllCourse);
router.get("/getStudentHistory", protect, getStudentHistory);
router.post(
  "/createCourse",
  protect,
  upload.fields([
    { name: "course_image", maxCount: 1 },
    { name: "course_material", maxCount: 2 },
  ]),
  createCourse
);
router.patch("/updateCourse/:id", protect, updateCourse);
router.delete("/deleteCourse/:id", protect, deleteCourse);
router.post("/addCourse", addCourse)
router.post("/requestCourse/:id", protect, courseRequest)

/**
 * @swagger
 * paths:
 *   /rate-courses/{id}:
 *   post:
 *     summary: Rate a course
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               description:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Successfully rated the course
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course not found
 *       422:
 *         description: Invalid request body
 */
router.post("/rate-courses/:id", protect, rateCourses);

export default router;

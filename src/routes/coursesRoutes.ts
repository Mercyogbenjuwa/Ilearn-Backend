import express from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourse,
  updateCourse,
  addCourse,
  courseRequest,
  requestCourseById,
  getCourseById,
  rateCourses,
} from "../controller/courseController";
import { getAllUsers, Login, Register } from "../controller/userController";
import { protect } from "../Middlewares/authMiddleware";
import { getStudentHistory } from "../controller/courseController";
import { upload } from "../utils/multer";
const router = express.Router();

//router.post("/addCourse", protect, addCourse);

/**
 * @openapi
 * /courses:
 *  get:
 *      description: get all courses
 *      responses:
 *        200:
 *          description: you have sucessfully retrieved all courses
 */
router.get("/", getAllCourse);

/**
 * @openapi
 * /courses/get-course/{id}:
 *  get:
 *     security:
 *       - Authorization: []
 *     description: Get a single course
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *        200:
 *          description: you have sucessfully retrieved a course
 *        404:
 *          description: course not found
 */
router.get("/get-course/:id", protect, getCourseById);

/**
 * @openapi
 * /courses/getStudentHistory:
 *  get:
 *      description: get student course history
 *      security:
 *       - Authorization: []
 *      responses:
 *        200:
 *          description: you have sucessfully retrieved all courses
 */
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
router.post("/addCourse", addCourse);
router.post("/requestCourse/:id", protect, courseRequest);

/**
 * @openapi
 *  /courses/rate-courses/{id}:
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

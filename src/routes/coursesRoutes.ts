import express from "express";
import { addCourse, getAllCourses } from "../controller/courseController";
import { protect } from "../Middlewares/authMiddleware";

const router = express.Router();

router.post("/addCourse", protect, addCourse);
router.get("/", getAllCourses);

export default router;

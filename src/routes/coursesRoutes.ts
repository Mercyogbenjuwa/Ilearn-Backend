import express from "express";
import { addCourse, createCourse, deleteCourse, getAllCourses, updateCourse } from "../controller/courseController";
import { getAllUsers, Login, Register } from "../controller/userController";
import { protect } from "../Middlewares/authMiddleware";
import { getStudentHistory } from "../controller/courseController";

const router = express.Router();

router.post("/addCourse", protect, addCourse);
router.get("/", getAllCourses);
router.get("/getStudentHistory", protect, getStudentHistory);
router.post("/createCourse", protect, createCourse);
router.put("/updateCourse", protect, updateCourse);
router.delete("/deleteCourse", protect, deleteCourse);


export default router;

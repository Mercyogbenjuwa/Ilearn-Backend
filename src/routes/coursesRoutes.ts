import express from "express";
import { addCourse, createCourse, deleteCourse, getAllCourse, updateCourse } from "../controller/courseController";
import { getAllUsers, Login, Register } from "../controller/userController";
import { protect } from "../Middlewares/authMiddleware";
import { getStudentHistory } from "../controller/courseController";

const router = express.Router();

router.post("/addCourse", protect, addCourse);
router.get("/", getAllCourse);
router.get("/getStudentHistory", protect, getStudentHistory);
router.post("/createCourse", protect, createCourse);
router.patch("/updateCourse/:id", protect, updateCourse);
router.delete("/deleteCourse/:id", protect, deleteCourse);


export default router;

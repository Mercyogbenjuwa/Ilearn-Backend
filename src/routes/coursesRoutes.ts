import express from "express";
import {  createCourse, deleteCourse, getAllCourse, updateCourse, addCourse} from "../controller/courseController";
import { getAllUsers, Login, Register } from "../controller/userController";
import { protect } from "../Middlewares/authMiddleware";
import { getStudentHistory } from "../controller/courseController";
import {upload} from "../utils/multer"
const router = express.Router();

//router.post("/addCourse", protect, addCourse);
router.get("/",getAllCourse);
router.get("/getStudentHistory", protect, getStudentHistory);
router.post("/createCourse", protect, upload.fields([{name: 'course_image', maxCount: 1}, {name: 'course_material', maxCount:2}]), createCourse);
router.patch("/updateCourse/:id", protect, updateCourse);
router.delete("/deleteCourse/:id", protect, deleteCourse);
router.post("/addCourse", addCourse)



export default router;

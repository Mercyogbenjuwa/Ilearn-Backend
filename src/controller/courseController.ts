import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { courseInstance } from "../model/courseModel";
import path from "path";
import { HttpError } from "http-errors";

const addCourse = async (req: Request, res: Response) => {
  try {
    const { name, description, category, price } = req.body;
    const course = await courseInstance.create({
      name,
      description,
      category,
      price,
    });

    return res.status(200).json({
      message: "Course created successfully",
      course: course,
    });
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/users/add-course",
      err,
    });
  }
};

//const getAllCourses = async () => {};

const getStudentHistory = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;

    const courses = await courseInstance.findAll({
      where: { tutorId: id },
    });
    return res.status(200).json({
      courses: courses,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
  console.log(req.user);
};

const getAllCourse = async (req: Request, res: Response) => {
  try {
    //const userId = req.user?.id;
    const course = await courseInstance.findAndCountAll(); //{ where: { id: userId } }
    return res.status(200).json({
      message: "You have successfully retrieved all courses",
      course: course,
    });
  } catch (err: any) {
    return res.status(500).json({
      route: "/users/get-all-courses",
      error: err.message,
    });
  }
};

const createCourse = async (req: JwtPayload, res: Response) => {
  try {
    //const userId = req.user?.id;

    const { title, description, category, pricing } = req.body;
    const newCourse = await courseInstance.create({
      title,
      description,
      course_image: req.files.course_image[0].path,
      pricing: pricing.toLocaleString(),
      category,
      tutorId: req.user?.id,
      course_material: req.files.course_material[0].path,
    });

    return res.status(200).json({
      message: "You have successfully created a course",
      course: newCourse,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      route: "/users/create-courses",
      error: error.message,
    });
  }
};

const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      pricing,
      category,
      course_image,
      tutorId,
      tutor_Name,
    } = req.body;
    // updating course
    const updateCourse = await courseInstance.update(
      {
        title,
        description,
        course_image,
        pricing: pricing.toLocaleString(),
        category,
        tutorId: req.user?.id,
        tutor_Name,
      },
      {
        where: { id: id },
      }
    );

    return res.status(200).json({
      message: "You have successfully updated a course",
      course: updateCourse,
    });

    const courses = await courseInstance.findAll();
    console.log(courses);

    //jggj

    res.send(courses);
  } catch (error) {
    res.send(error);
  }
};

const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteCourse = await courseInstance.destroy({
      where: { id: id },
    });

    return res.status(200).json({
      message: "You have successfully deleted a course",
      course: deleteCourse,
    });
    //jggj
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/users/delete-courses",
    });
  }
};

export {
  getAllCourse,
  getStudentHistory,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourse,
};

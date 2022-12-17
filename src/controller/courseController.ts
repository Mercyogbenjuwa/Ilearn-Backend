import { Express, Request, Response } from "express";
import { courseInstance } from "../model/courseModel";
import { UserInstance } from "../model/userModel";

const addCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, pricing, category, image } = req.body;
    const newCourse = {
      title,
      description,
      image,
      pricing: pricing.toLocaleString(),
      category,
      tutorId: req.user?.id,
    };
    await courseInstance.create(newCourse);

    const courses = await courseInstance.findAll();
    console.log(courses);

    //jggj

    res.send(courses);
  } catch (error) {
    res.send(error);
  }
};
const getAllCourses = async () => {};

export { addCourse, getAllCourses };

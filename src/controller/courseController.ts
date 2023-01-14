import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { courseInstance } from "../model/courseModel";
import path from "path";
import { HttpError } from "http-errors";
import { courseRequestInstance } from "../model/courseRequestsModel";
import { NotificationInstance } from "../model/notificationModel";
import { UserInstance } from "../model/userModel";
import { Includeable } from "sequelize";
import { CourseRatingInstance } from "../model/courseRatingModel";
import { option, ratingCourseSchema } from "../utils/utility";

UserInstance;
interface requestedCourse extends courseInstance {
  tutor: UserInstance;
}

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

    console.log("test");
    const { title, description, category, pricing } = req.body;

    const newCourse = await courseInstance.create({
      title,
      description,
      course_image: req.files?.course_image[0].path,
      pricing: pricing.toLocaleString(),
      category,
      tutorId: req.user?.id,
      course_material: req.files?.course_material[0].path,
    });

    return res.status(200).json({
      message: "You have successfully created a course",
      course: newCourse,
    });
  } catch (error: any) {
    return res.status(500).json({
      route: "/users/create-courses",
      error: error.errors[0].message,
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

/**=========================== get AllNotifications for students ============================== **/

const courseRequest = async (req: Request, res: Response) => {
  try {
    //student Id requesting the course
    const id = req.user?.id;
    const courseId = req.params.id;

    //First check if that course exist and include the tutor details
    let course = (await courseInstance.findOne({
      where: {
        id: courseId,
      },
      include: ["tutor"],
    })) as requestedCourse;

    if (!course) return res.status(400).json({ Error: "No such course exist" });

    const courseRequested = await courseRequestInstance.findOne({
      where: {
        studentId: id,
        courseId,
        status: "pending",
        tutorId: course.tutor.id,
      },
    });

    ///check if you user has already requested a course
    if (courseRequested)
      return res.status(400).json({
        Error:
          "You have already requested this course, please wait for a response",
      });

    //Create course request
    const requestedCourse = await courseRequestInstance.create({
      courseId,
      tutorId: course.tutorId,
      studentId: id,
    });

    //Create notification for the tutor base on the user request.
    await NotificationInstance.create({
      notificationType: "course request",
      receiver: course.tutorId,
      description: `A student requested ${course.title}`,
      sender: id,
      courseId,
    });
    // also for user
    //Return a message, your course request is successful
    return res.status(200).json({
      message: `you have successfully requested for ${course.title}`,
      course,
      requestedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal Server Error /users/getNotifications",
      error,
    });
  }
};

// ================================= Course Rating ==============================
const rateCourses = async (req: Request, res: Response) => {
  const { id } = req.user!;

  try {
    const validateResult = ratingCourseSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    const { courseId, ratingValue, description } = validateResult.value;

    const course = await courseInstance.findOne({
      where: { id: req.params.id },
    });
    if (!course) {
      return res.status(400).json({
        Error: "Course does not exist",
      });
    }
    const alreadyRatedCourse = await CourseRatingInstance.findOne({
      where: { studentId: id, courseId: req.params.id },
    });
    if (alreadyRatedCourse) {
      console.log(alreadyRatedCourse);
      return res
        .status(401)
        .send({ message: "You cannot rate a course more than once" });
      
    }
    
    const rateCourse = await CourseRatingInstance.create({
      ratingValue,
      description,
      courseId: req.params.id,
      studentId: id,
    });

    const courseRatings = await CourseRatingInstance.findAll({
      where: { courseId: req.params.id },
    });
    const totalRating = courseRatings.reduce((acc, curr) =>
    {
      return acc + curr.ratingValue;
    }, 0);
    const averageRating = totalRating / courseRatings.length;
    await courseInstance.update(
      { rating: averageRating },
      { where: { id: req.params.id } }
    );

    return res.status(200).json({
      message: "Course rated successfully",
      rateCourse,
    });

  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/courses/rate-course",
      err,
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
  courseRequest,
  rateCourses,
};

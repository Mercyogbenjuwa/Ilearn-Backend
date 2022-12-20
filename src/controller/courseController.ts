import { Request, Response } from "express";
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

    res.send(courses);
  } catch (error) {
    res.send(error);
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

const getAllCourses = async () => {
  const course = [
    {
      category: "python",
      categoryId: 1,
      course: [
        {
          name: "John Anna",
          course: "Python for beginners",
          courseId: 1,
          image: "https://images.pexels.com/photos/14491698/pexels-photo-14491698.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
        },
        {
          name: "Fabian Orange",
          course: "Python for intermediate",
          courseId: 2,
          image: "https://images.pexels.com/photos/9433003/pexels-photo-9433003.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
        }
      ]
    },
    {
      category: "javascript",
      categoryId: 2,
      course: [
        {
          name: "Oral Roberts",
          course: "Javascript made easy",
          courseId: 3,
          image: "https://images.pexels.com/photos/14491698/pexels-photo-14491698.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
        }, 
        {
          name: "Samuel Ortom",
          course: "The secret of javascript",
          courseId: 4,
          image: "https://images.pexels.com/photos/9433003/pexels-photo-9433003.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
        }
      ]
    }
    ];

    return course;
}
  const createCourse = async (req: Request, res: Response) => {
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
  }  

  const updateCourse = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, pricing, category, image } = req.body;
      const newCourse = {
        title,
        description,
        image,
        pricing: pricing.toLocaleString(),
        category,
        tutorId: req.user?.id,
      };
      await courseInstance.update(newCourse, {
        where: { id: id },
      });
  
      const courses = await courseInstance.findAll();
      console.log(courses);
  
      //jggj
  
      res.send(courses);
    } catch (error) {
      res.send (error);
    }
  };

  const deleteCourse = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await courseInstance.destroy({
        where: { id: id },
      });
  
      const courses = await courseInstance.findAll();
      console.log(courses);
  
      //jggj
  
      res.send(courses);
    } catch (error) {
      res.send (error);
  }

  
  };



// This logic creates a logic to upload pdf file from tutor to student
const uploadPdf = async (req: Request, res: Response) => {
  try {
const{title, name} = req.body;
    const { id } = req.params;
    const { pdf } = req.body;
    const course = await courseInstance.findOne({
      where: { id: id },
    });
    if (course) {
      course.pdf = pdf;
      await course.save();
      res.send(course);
    }
  } catch (error) {
    res.send(error);
  }
}; 

// create a logic to upload image file from tutor, include course title & name of the tutor

const uploadImage = async (req: Request, res: Response) => {
  try {
    const {title, name} = req.body;
    const { id } = req.params;
    const { image } = req.body;
    const course = await courseInstance.findOne({
      where: { id: id },
    });
    if (course) {
      course.image = image;
      await course.save();
      res.send(course);
    }
  } catch (error) {
    res.send
  }
};


//export { addCourse, getAllCourses, getStudentHistory };























export { addCourse, getAllCourses, getStudentHistory, createCourse, updateCourse, deleteCourse, uploadPdf, uploadImage };


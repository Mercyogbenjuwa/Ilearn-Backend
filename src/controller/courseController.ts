import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { courseInstance } from "../model/courseModel";
import { UserInstance} from "../model/userModel";
import multer from 'multer';


const addCourse = async (req: JwtPayload, res: Response) => {
  try {
    //const {id} = req.tutor
    //const tutor = await UserInstance.findOne({where: {id: id}})

    
    const { title, description,tutor_Name, tutorId, pricing, category, image, pdf } = req.body;
    
    //if (tutor) {
      const createCourse = await courseInstance.create({
        title: '',
        description: '', 
        tutor_Name: '',
        tutorId: req.user?.id,
        pricing: 0,
        category: '', 
        image: '', 
        pdf: '',
    })
 // }

    // const newCourse = {
    //   title,
    //   description,
    //   image: req.file.path,
    //   pricing: pricing.toLocaleString(),
    //   category,
    //   tutorId: req.user?.id,
    //   pdf: req.file.path,
    // };
    // await courseInstance.create(newCourse);

    // const courses = await courseInstance.findAll();
    // console.log(courses);

    // res.send(courses);
    return res.status(200).json({
      message: "Course created successfully",
      createCourse,
    });
}
   catch (error) {
    console.log(error);
    // return res.status(500).json({
    //   Error: "Internal server Error",
    //   route: "/users/add-course",
  //})
};
}

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
    const course = await courseInstance.findAndCountAll();  //{ where: { id: userId } }
    return res.status(200).json({
      message: "You have successfully retrieved all courses",
      course: course,
    });
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/users/get-all-courses",
    });
  }
};

// const getAllCourses = async () => {
//   const course = [
//     {
//       category: "python",
//       categoryId: 1,
//       course: [
//         {
//           name: "John Anna",
//           course: "Python for beginners",
//           courseId: 1,
//           image: "https://images.pexels.com/photos/14491698/pexels-photo-14491698.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
//         },
//         {
//           name: "Fabian Orange",
//           course: "Python for intermediate",
//           courseId: 2,
//           image: "https://images.pexels.com/photos/9433003/pexels-photo-9433003.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
//         }
//       ]
//     },
//     {
//       category: "javascript",
//       categoryId: 2,
//       course: [
//         {
//           name: "Oral Roberts",
//           course: "Javascript made easy",
//           courseId: 3,
//           image: "https://images.pexels.com/photos/14491698/pexels-photo-14491698.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
//         }, 
//         {
//           name: "Samuel Ortom",
//           course: "The secret of javascript",
//           courseId: 4,
//           image: "https://images.pexels.com/photos/9433003/pexels-photo-9433003.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
//         }
//       ]
//     }
//     ];

//     return course;
// }
  const createCourse = async (req: Request, res: Response) => {
    try {
      //const userId = req.user?.id;

      
      
      const { title, description, category, image, pricing, tutor_Name} = req.body;
      console.log(req.body);
      //const user = await UserInstance.findOne({ where: { id: userId } });
      //if (user) {
      const newCourse = await courseInstance.create({
        title,
        description,
        image,
        pricing: pricing.toLocaleString(),
        category,
        tutor_Name,
      });

      return res.status(200).json({
        message: "You have successfully created a course",
        course: newCourse,
      });
  
  }
  catch (error) {
      return res.status(500).json({
      Error: "Internal server Error",
      route: "/users/create-courses",
      error
    });
    }
  }  

  const updateCourse = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, pricing, category, image, tutorId, tutor_Name } = req.body;
     // updating course 
      const updateCourse = await courseInstance.update({
        title,
        description,
        image,
        pricing: pricing.toLocaleString(),
        category,
        tutorId: req.user?.id,
        tutor_Name,
      }, {
        where: { id: id },
      });

      return res.status(200).json({
        message: "You have successfully updated a course",
        course: updateCourse,
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
      const deleteCourse = await courseInstance.destroy({
        where: { id: id },
      });
  
      return res.status(200).json({
        message: "You have successfully deleted a course",
        course: deleteCourse,
      });
      //jggj
  ;
    } catch (error) {
      return res.status(500).json({
        Error: "Internal server Error",
        route: "/users/delete-courses",
      });
  }

  
  };



// This logic creates a logic to upload pdf file from tutor to student
const uploadPdf = async (req: Request, res: Response) => {
  try {
const{title, name} = req.body;
    const { id } = req.params;
    const { pdf } = req.body;
    const course = await courseInstance.create({
        Description: 
        Image, 
        File: pdf
  ,
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


export { addCourse, getAllCourse, getStudentHistory, createCourse, updateCourse, deleteCourse, uploadPdf, uploadImage };


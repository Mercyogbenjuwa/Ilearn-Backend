import { Request, Response, NextFunction } from "express";
import { UserAttributes, UserInstance } from "../model/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
  forgotPasswordSchema,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  loginSchema,
  option,
  registerSchema,
  resetPasswordSchema,
  updateTutorSchema,
  validatePassword,
  verifySignature,
  validateReminder,
} from "../utils/utility";
import {
  emailHtml,
  emailHtml2,
  emailHtml3,
  GenerateOTP,
  mailSent,
  mailSent2,
} from "../utils/notification";
import { APP_SECRET, FromAdminMail, userSubject } from "../Config";
import { courseRequestInstance } from "../model/courseRequestsModel";
import { link } from "joi";
import { ReminderInstance } from "../model/reminderModel";
import { courseInstance } from "../model/courseModel";
import { Op } from "sequelize";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserInstance.findAll({
      attributes: { exclude: ["password", "salt"] },
    });
    // console.log(req.user && req.user.toJSON());

    res.status(200).json(users);
  } catch (error) {
    res.status(401).send("An error occurred");
  }
};

/**===================================== Register User ===================================== **/
const Register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, confirm_password, areaOfInterest, userType } =
      req.body;
    const uuiduser = uuidv4();
    //console.log(req.body)
    const validateResult = registerSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    //Generate salt
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    //check if the user exists
    const User = await UserInstance.findOne({ where: { email: email } });
    if (User) {
      return res.status(400).json({
        message: "User already exist!",
      });
    }
    //Create User
    let createdUser;

    if (!User) {
      createdUser = await UserInstance.create({
        id: uuiduser,
        email,
        password: userPassword,
        name: "",
        areaOfInterest,
        userType,
        verified: false,
        salt,
        image: "",
      });

      if (!createdUser) {
        return res.status(500).send({ message: "unable to create user" });
      }

      let signature = await GenerateSignature({
        id: createdUser.id,
        email: createdUser.email,
        verified: createdUser.verified,
      });
      console.log(process.env.fromAdminMail, email, userSubject);

      // send Email to user
      const link = `Press <a href=${process.env.BASE_URL}/users/verify/${signature}> here </a> to verify your account. Thanks.`;
      const html = emailHtml3(link);
      await mailSent(
        process.env.fromAdminMail!,
        email,
        "Ilearn User Verification",
        html
      );

      //check if user exist

      return res.status(201).json({
        message:
          "You have registered successfully, Check your email for verification",
      });
    }
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/signup",
      err,
    });
  }
};

/**==================== Verify Users ========================**/
export const verifyUser = async (req: JwtPayload, res: Response) => {
  try {
    const token = req.params.signature;
    // Verify the signature
    const { id, email, verified } = await verifySignature(token);
    // Find the user with the matching verification token
    const user = await UserInstance.findOne({ where: { id } });
    if (!user) {
      throw new Error("Invalid verification token");
    }

    // Set the user's verified status to true
    const User = await UserInstance.update(
      {
        verified: true,
      },
      { where: { id } }
    );

    await user.save();

    // Redirect the user to the login page
    return res.redirect(301, `${process.env.CLIENT_URL}/login`);

    // res
    //   .status(200)
    //   .send({
    //     message: "user has been verified successfully",
    //     success: true,
    //   })
    //   .redirect(`${process.env.CLIENT_URL}/login`);

    // Send a success response to the client

    // return res.status(201).json({ message: 'Your email has been verified.' });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/verify",
    });
  }
};

/**==================== Login User ========================**/
const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const validateResult = loginSchema.validate(req.body, option);
    console.log("bug");
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //check if the user exist
    const User = await UserInstance.findOne({
      where: { email: email },
    });
    console.log(User);

    if (!User) {
      return res.status(400).json({
        Error: "Wrong Username or password",
      });
    }

    if (User.verified) {
      const validation = await validatePassword(
        password,
        User.password,
        User.salt
      );
      if (validation) {
        //Regenerate a signature
        let signature = await GenerateSignature({
          id: User.id,
          email: User.email,
          verified: User.verified,
        });

        return res.status(200).json({
          message: "You have successfully logged in",
          signature,
          email: User.email,
          verified: User.verified,
        });
      }
      return res.status(400).json({
        Error: "Wrong Username or password",
      });
    }
    return res.status(400).json({
      Error: "you have not been verified",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/login",
    });
  }
};

/**=========================== Resend Password ============================== **/
// febic69835@bitvoo.com

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const validateResult = forgotPasswordSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //check if the User exist
    const oldUser = await UserInstance.findOne({
      where: { email: email },
    });

    //console.log(oldUser);
    if (!oldUser) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    const secret = APP_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
      expiresIn: "1d",
    });
    const link = `${process.env.CLIENT_URL}/users/resetpassword/?userId=${oldUser.id}&token=${token}`;
    if (oldUser) {
      const html = emailHtml2(link);
      await mailSent2(FromAdminMail, oldUser.email, userSubject, html);
      return res.status(200).json({
        message: "password reset link sent to email",
        link,
      });
    }
    //console.log(link);
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/forgot-password",
    });
  }
};

//On clicking the email link ,

const resetPasswordGet = async (req: Request, res: Response) => {
  const { id, token } = req.params;
  const oldUser = await UserInstance.findOne({
    where: { id: id },
  });
  if (!oldUser) {
    return res.status(400).json({
      message: "User Does Not Exist",
    });
  }
  const secret = APP_SECRET + oldUser.password;
  console.log(secret);
  try {
    const verify = jwt.verify(token, secret);
    return res.status(200).json({
      email: oldUser.email,
      verify,
    });
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/resetpassword/:id/:token",
    });
  }
};

// Page for filling the new password and confirm password

const resetPasswordPost = async (req: Request, res: Response) => {
  const { id, token } = req.params;
  const { password } = req.body;
  console.log(req.body);

  const validateResult = resetPasswordSchema.validate(req.body, option);
  if (validateResult.error) {
    return res.status(400).json({
      Error: validateResult.error.details[0].message,
    });
  }
  const oldUser = await UserInstance.findOne({
    where: { id: id },
  });
  if (!oldUser) {
    return res.status(400).json({
      message: "user does not exist",
    });
  }
  const secret = APP_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, oldUser.salt);
    const updatedPassword = (await UserInstance.update(
      {
        password: encryptedPassword,
      },
      { where: { id: id } }
    )) as unknown as UserAttributes;
    return res.status(200).json({
      message: "you have succesfully changed your password",
      updatedPassword,
    });
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/resetpassword/:id/:token",
    });
  }
};

/**=========================== Create a new Reminders============================== **/
const createReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, description, startTime, endTime } = req.body;
    const { error } = validateReminder(req.body);

    if (error) return res.status(400).send({ Error: error.details[0].message });

    const startDate: Date = new Date(startTime);

    // calculate current date time that is one hour behind
    const currentDate =
      new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000;

    // check if the time is not in the past
    if (startDate.getTime() < currentDate) {
      res.status(405).send({
        Error: "Please choose a more current time",
      });
      return;
    }
    // create the reminder
    await ReminderInstance.create({
      title,
      description,
      startTime,
      endTime,
      userId,
    });
    res.status(200).send({
      message: "Reminder created sucessfully",
    });
  } catch (error) {
    res.status(500).json({
      Error: error,
    });
  }
};

/**=========================== Get all Reminders============================== **/

const getAllReminders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const reminders = await ReminderInstance.findAll({ where: { id: userId } });
    return res.status(200).json({
      message: "You have successfully retrieved all reminders",
      reminders: reminders,
    });
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/users/get-all-reminders",
    });
  }
};

/**==================== Get all recmmended courses================**/
const getRecommendedCourses = async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    // const id = req.user?.id

    const recommendedCourse = await courseInstance.findAll({
      where: { category, rating: { [Op.gt]: 0 } },
      attributes: [
        "id",
        "title",
        "course_image",
        "rating",
        "pricing",
        "description",
        "category",
      ],
      order: [["rating", "DESC"]],
      limit: 10,
    });
    if (!recommendedCourse) {
      return res.status(400).json({ message: "No recommended courses found" });
    }
    res.status(200).json({
      message: "Recommended courses found",
      recommendedCourse,
    });
  } catch (error: any) {
    res.status(500).json({ Error: error.message });
  }
};

/**=========================== updateTutorProfile ============================== **/

export const updateTutorProfile = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;

    const { name, areaOfInterest } = req.body;
    const joiValidateTutor = updateTutorSchema.validate(req.body, option);
    if (joiValidateTutor.error) {
      return res.status(400).json({
        Error: joiValidateTutor.error.details[0].message,
      });
    }

    const courses = await courseInstance.findAndCountAll({
      where: { tutorId: id },
    });

    const totalCourses = courses.count.toString();

    const tutor = await UserInstance.findOne({ where: { id } });
    if (tutor === null) {
      return res.status(400).json({
        Error: "You are not authorized to update your profile",
      });
    }
    // console.log(Tutor);

    await tutor.update({
      image: req.file?.path,
      name,
      totalCourses,
      areaOfInterest,
    });

    const updateTutor = await tutor.save();
    // await updateTutor.save({fields: ['name', 'totalCourses', 'areaOfInterest', 'image']})
    // this is for saving some fields

    if (updateTutor) {
      const tutor = await UserInstance.findOne({ where: { id } });
      return res.status(200).json({
        message: "You have successfully updated your account",
        tutor,
      });
    }

    return res.status(400).json({
      Error: "There's an error",
    });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server error",
      route: "/vendor/update-profile",
      error,
    });
  }
};

/**=========================== get Tutor Details ============================== **/

export const getTutorDetails = async (req: Request, res: Response) => {
  try {
    const tutorId = req.params.tutorid;

    const tutorDetails = await UserInstance.findOne({ where: { id: tutorId } });
    if (tutorDetails !== null) {
      return res.status(200).json({
        message: tutorDetails,
      });
    }
    return res.status(400).json({
      Error: "Tutor does not exist",
    });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server error",
      route: "/vendor/update-profile",
    });
  }
};

const getAllTutors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const findTutor = await UserInstance.findAll({
      where: { userType: "Tutor" },
      attributes: ["id", "email", "name", "rating"],
    });
    return res.status(200).json({
      TutorNumber: findTutor.length,
      findTutor,
    });
  } catch (error) {
    console.log(error);
  }
};
const tutorRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page: any = req.query.page;
    let limit: any = req.query.limit;

    const offset = page ? page * limit : 0;

    const tutorSorted = await UserInstance.findAll({
      where: { userType: "Tutor", rating: { [Op.gt]: 0 } },
      attributes: ["id", "email", "name", "image", "rating"],
      order: [["rating", "DESC"]],
      limit: limit,
      offset: offset,
    });
    return res.status(200).json({
      TutorNumber: tutorSorted.length,
      tutorSorted,
    });
  } catch (err) {
    console.log(err);
  }
};
export {
  Login,
  Register,
  getAllUsers,
  forgotPassword,
  resetPasswordGet,
  resetPasswordPost,
  createReminder,
  getRecommendedCourses,
  getAllReminders,
  tutorRating,
  getAllTutors,
};

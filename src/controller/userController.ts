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
} from "../utils/utility";
import {
  emailHtml,
  emailHtml2,
  GenerateOTP,
  mailSent,
  mailSent2,
} from "../utils/notification";
import { APP_SECRET, FromAdminMail, userSubject } from "../Config";
import { courseInstance } from "../model/courseModel";

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

    //Generate OTP
    const { otp, expiry } = GenerateOTP();

    //check if the user exists
    const User = await UserInstance.findOne({ where: { email: email } });
    //Create User

    if (!User) {
      const createUser = await UserInstance.create({
        id: uuiduser,
        email,
        password: userPassword,
        name: "",
        areaOfInterest,
        userType,
        verified: false,
        salt,
        image: "",
        totalCourses: ""
      });

      //console.log("create user is ", createUser)

      // send Email to user
      const html = emailHtml(otp);
      // await mailSent(FromAdminMail, email, userSubject, html);

      //check if user exist
      const User = await UserInstance.findOne({
        where: { email: email },
      });
      if (!User) {
        return res.status(400).json("no user was created");
      }
      // Generate a signature for user
      let signature = await GenerateSignature({
        id: User.id,
        email: User.email,
        verified: User.verified,
      });
      return res.status(201).json({
        message:
          "User created successfully Check your email for OTP verification",
        signature,
        verified: User.verified,
      });
    }
    return res.status(400).json({
      message: "User already exist!",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/signup",
      err,
    });
  }
};

/**===================================== Login Users ===================================== **/
const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const validateResult = loginSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //check if the user exist
    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttributes;
    console.log(User.toJSON());

    if (User.verified === false) {
      const validation = await validatePassword(
        password,
        User.password,
        User.salt
      ); /*can equally use bcrypt.compare() */
      if (validation) {
        //Generate signature for the user
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
          name: User.name,
        });
      }
    }
    res.status(400).json({
      Error: "Wrong Username or password",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/login",
      err,
    });
  }
};

/**=========================== Resend Password ============================== **/

/*export*/ const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const validateResult = forgotPasswordSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //check if the User exist
    const oldUser = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttributes;
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
    const link = `http://localhost:4000/users/resetpassword/${oldUser.id}/${token}`;
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

/*export*/ const resetPasswordGet = async (req: Request, res: Response) => {
  const { id, token } = req.params;
  const oldUser = (await UserInstance.findOne({
    where: { id: id },
  })) as unknown as UserAttributes;
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

// Page for filling the new password and condfirm password

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

/**=========================== updateTutorProfile ============================== **/

export const updateTutorProfile = async(req: JwtPayload, res: Response) => {
  try {
    const {id} = req.user
    
    const {image, name, areaOfInterest} = req.body
    const joiValidateTutor = updateTutorSchema.validate(req.body, option)
    if(joiValidateTutor.error){
        return res.status(400).json({
            Error: joiValidateTutor.error.details[0].message
        })
    }
    console.log(name);
    
    const courses = await courseInstance.findAndCountAll({
      where: { tutorId: id },
    });

    const totalCourses = courses.count.toString()
    
    const Tutor = await UserInstance.findOne({where:{id}});
    if(Tutor === null){
        return res.status(400).json({
            Error: "You are not authorized to update your profile"
        })
    }
    
    await Tutor.update({
        image: req.file.path, name, totalCourses, areaOfInterest
    });

    const updateTutor = await Tutor.save()
    // await updateTutor.save({fields: ['name', 'totalCourses', 'areaOfInterest', 'image']})
    // this is for saving some fields
  

    if(updateTutor){
        const Tutor = await UserInstance.findOne({where:{id}});
        return res.status(200).json({
            message: "You have successfully updated your account",
            Tutor
        })
    }

    return res.status(400).json({
        Error: "There's an error"
    })
} catch (error) {
    return res.status(500).json({
        Error: "Internal server error",
        route: "/vendor/update-profile"
    })
}
}

/**=========================== get Tutor Details ============================== **/

export const getTutorDetails = async(req: Request, res: Response) => {
  try {
    const tutorid = req.params.tutorid

    const tutorDetails = await UserInstance.findOne({where:{id:tutorid}})
    if(tutorDetails !== null){
      return res.status(200).json({
        message: tutorDetails
      })
    }
    return res.status(400).json({
      Error: "Tutor does not exist"
    })
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server error",
      route: "/vendor/update-profile"
  })
  }
}

export {
  Login,
  Register,
  getAllUsers,
  forgotPassword,
  resetPasswordGet,
  resetPasswordPost,
};

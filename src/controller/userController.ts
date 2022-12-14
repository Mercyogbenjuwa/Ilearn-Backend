import { Request, Response, NextFunction } from "express";
import { UserAttributes, UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  loginSchema,
  option,
  registerSchema,
  validatePassword,
} from "../utils/utility";
import { emailHtml, GenerateOTP, mailSent } from "../utils/notification";
import { FromAdminMail, userSubject } from "../Config";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserInstance.findAll({
      attributes: { exclude: ["password", "salt"] },
    });
    // console.log(req.user && req.user.toJSON());

    res.status(200).send(users);
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
      });

      //console.log("create user is ", createUser)

      // send Email to user
      const html = emailHtml(otp);
      // await mailSent(FromAdminMail, email, userSubject, html);
      //
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

export { Login, Register, getAllUsers };

import Joi from "joi";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthPayload } from "../interface/auth.dto";
import { APP_SECRET } from "../Config";

export const registerSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  userType: Joi.string().required(),
  areaOfInterest: Joi.string().required(),
  // confirm_password: Joi.any()
  //   .equal(Joi.ref("password"))
  //   .required()
  //   .label("Confirm password")
  //   .messages({ "any.only": "{{#label}} does not match" }),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const option = {
  abortEarly:
    false /* means if there's an error in the first keys, it'll takecare of the error 
                              first before moving on to the next error  */,
  errors: {
    wrap: { label: "" },
  },
};

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const GenerateSignature = async (payload: AuthPayload) => {
  try {
    return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
  } catch (error) {
    throw "could not create a token";
  } /*1d means 1 day */
};

export const verifySignature = async (signature: string) => {
  return jwt.verify(signature, APP_SECRET) as JwtPayload;
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

//schema for reset Password
export const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().required(),
});
export const resetPasswordSchema = Joi.object().keys({
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
  //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({
      "any.only": "passwords does not match",
      "any.required": "You need to add a confirm password",
    }),
});

export const updateTutorSchema = Joi.object().keys({
  name: Joi.string(),
  image: Joi.string(),
  areaOfInterest: Joi.string(),
  rating: Joi.number()
});
// validate schema for creating of reminders

export const validateReminder = (input: {}) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(3)
      .required()
      .messages({ "any.required": "A title is required" }),

    description: Joi.string().min(30).required().messages({
      "any.only": "Description should not be more than 30 characters",
      "any.required": "You need to add a description",
    }),
    startTime: Joi.string().isoDate().required().messages({
      "any.required": "You need to add a start time",
      "any.isoDate": "Start time should be an ISO Date",
    }),

    endTime: Joi.string().isoDate().required().messages({
      "any.required": "You need to add an End time",
      "any.isoDate": "End time should be an ISO Date",
    }),
  });
  return schema.validate(input);
};


//schema for create_course

export const createCourseSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  image: Joi.string().required(),
  video: Joi.string().required(),
  file: Joi.string().required(),
});


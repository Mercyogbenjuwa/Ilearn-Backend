import { Sequelize, Model, DataTypes } from "sequelize";
import { db } from "../Config/index";
import { courseInstance } from "./courseModel";
import { ReminderInstance } from "./reminderModel";

export interface UserAttributes {
  [x: string]: any;
  id: string;
  name: string;
  email: string;
  password: string;
  areaOfInterest: string;
  userType: string;
  verified: boolean;
  salt: string;
  image: string;
  rating: number
}

export class UserInstance extends Model<UserAttributes> {

  declare id: string;
  declare email: string;
  declare name: string;
  declare password: string;
  declare areaOfInterest: string;
  declare userType: string;
  declare verified: boolean;
  declare salt: string;
  declare image: string;
  declare rating: number

}

UserInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      //defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "Email address required" },
        isEmail: { msg: "Please provide a valid email" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password is required" },
        notEmpty: { msg: "Provide a password" },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: { msg: "User must be verified" },
        notEmpty: { msg: "User not verified" },
      },
      defaultValue: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Salt is required" },
        notEmpty: { msg: "Provide a salt" },
      },
    },
    areaOfInterest: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        customValidator: (value: any) => {
          const enums = ["Tutor", "Student"]; // to be changed to small letter
          if (!enums.includes(value)) {
            throw new Error("value should be a Student or a Tutor");
          }
        },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

  },

  {
    sequelize: db,
    tableName: "user",
  }
);
UserInstance.hasMany(courseInstance, {
  foreignKey: "tutorId",
  as: "course",
});

UserInstance.hasMany(ReminderInstance, {
  foreignKey: "userId",
  as: "reminder",
});

courseInstance.hasOne(UserInstance, {
  foreignKey: "tutorId",
  as: "user",
});

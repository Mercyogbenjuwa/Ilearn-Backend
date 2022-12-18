import { Sequelize, Model, DataTypes } from "sequelize";
import { db } from "../Config/index";

export interface TutorAttributes {
  [x: string]: any;
  id: string;
  name: string;
  description: string;
  image: string;
  email: string;
  password: string;
  areaOfInterest: string;
  userType: string;
  verified: boolean;
  salt: string;
}

export class TutorInstance extends Model<TutorAttributes> {
  declare id: string;
  declare name: string;
  declare totalCourses: string;
  declare image: string;
  declare email: string;
  declare password: string;
  declare areaOfInterest: string;
  declare userType: string;
  declare verified: string;
  declare salt: string;
}

TutorInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalCourses: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    areaOfInterest: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.STRING,
      allowNull: false,
    //   validate: {
    //     notNull: { msg: "Tutor must be verified" },
    //     notEmpty: { msg: "Tutor not verified" },
    //   },
    //   defaultValue: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    sequelize: db,
    tableName: "tutors",
  }
);

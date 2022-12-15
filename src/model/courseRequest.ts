import { Sequelize, Model, DataTypes } from "sequelize";
import { db } from "../Config/index";

export interface courseRequestAttributes {
  [x: string]: any;
  id: string;
  status: string;
  course_Id: string;
  tutor_Id: string;
  studentId: string;
}

export class courseRequestInstance extends Model<courseRequestAttributes> {
  declare id: string;
  declare status: string;
  declare tutor_Id: string;
  declare studentId: string;
  declare course_Id: string;
}

courseRequestInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      // defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    
    tutor_Id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_Id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    
  },

  {
    sequelize: db,
    tableName: "courses",
  }
);

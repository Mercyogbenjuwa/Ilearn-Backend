import { Sequelize, Model, DataTypes } from "sequelize";
import { db } from "../../../Config/index";
import { UserInstance } from "../../userModel";
import { courseInstance } from "../../courseModel";

export interface StudentCoursesAttributes {
  [x: string]: any;
  id: string;
  courseId: string;
  studentId: string;
  tutorId: string;
  progress: number;
}

export class StudentCoursesInstance extends Model<StudentCoursesAttributes> {
  declare id: string;
  declare courseId: string;
  declare studentId: string;
  declare tutorId: string;
  declare progress: number;
}

StudentCoursesInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: false,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tutorId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
  },

  {
    sequelize: db,
    tableName: "student_courses",
  }
);

StudentCoursesInstance.belongsTo(UserInstance, {
  foreignKey: "studentId",
  as: "student",
});

StudentCoursesInstance.belongsTo(UserInstance, {
  foreignKey: "tutorId",
  as: "tutor",
});

StudentCoursesInstance.belongsTo(courseInstance, {
  foreignKey: "courseId",
  as: "course",
});

import { Sequelize, Model, DataTypes } from "sequelize";
import { db } from "../Config/index";

export interface courseAttributes {
  [x: string]: any;
  id: string;
  title: string;
  description: string;
  tutor_Name: string;
  tutorId: string;
  pricing: string;
  category: string;
  pdf: string;
}

export class courseInstance extends Model<courseAttributes> {
  declare id: string;
  declare title: string;
  declare description: string;
  declare tutor_Name: string;
  declare tutorId: string;
  declare pricing: string;
  declare category: string;
  declare image: string;
  declare pdf: string;
}

courseInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tutor_Name: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tutorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    pricing: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
    pdf: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },

  {
    sequelize: db,
    tableName: "courses",
  }
);

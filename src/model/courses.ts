import { Sequelize, Model, DataTypes } from "sequelize";
import { db } from "../Config/index";

export interface courseAttributes {
  [x: string]: any;
  id: string;
  title: string;
  description: string;
  tutor_Id: string;
  pricing: string;
  category: string;
  updated: boolean;
}

export class courseInstance extends Model<courseAttributes> {
  declare id: string;
  declare title: string;
  declare description: string;
  declare tutor_Id: string;
  declare pricing: string;
  declare category: string;
  declare updated: boolean;
}

courseInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      // defaultValue: DataTypes.UUIDV4,
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
    tutor_Id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    pricing: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
  },

  {
    sequelize: db,
    tableName: "courses",
  }
);

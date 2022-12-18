import { Sequelize, Model, DataTypes } from "sequelize";
import { db } from "../Config/index";

export interface ReminderAttributes {
  [x: string]: any;
  title: string;
  description: string;
  startTime: Date;
  duration: number;
  endTime: Date;
  userId: string;
}

export class ReminderInstance extends Model<ReminderAttributes> {
  declare title: string;
  declare description: string;
  declare startTime: Date;
  declare duration: number;
  declare endTime: Date;
  declare userId: string;
  
}

ReminderInstance.init(
  {
    
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    duration: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },

    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
  },
},

  {
    sequelize: db,
    tableName: "reminder",
  }
);

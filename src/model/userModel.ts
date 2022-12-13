import { Sequelize, Model, DataTypes } from 'sequelize';
import { db } from '../Config/index';

export interface UserAttributes{
    id: string,
    name: string,
    email: string;
    password: string;
    areaOfInterest: string;
    userType: string;
    verified: boolean;
    salt: string;
}

export class UserInstance extends Model<UserAttributes>{}

UserInstance.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        // defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {msg: "Email address required"},
            isEmail: {msg: "Please provide a valid email"}
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: "Password is required"},
            notEmpty: {msg: "Provide a password"}
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {msg: "User must be verified"},
            notEmpty: {msg: "User not verified"}
        }
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: "Salt is required"},
            notEmpty: {msg: "Provide a salt"}
        }
    },
    areaOfInterest: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  userType: {
        type: DataTypes.STRING,
        allowNull: true,
        
        
    }
},

    {
        sequelize: db,
        tableName: 'user'
    });
    
        
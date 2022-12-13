import {Sequelize} from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()

export const db = new Sequelize('app', 'postgres', 'test', {
    host:'localhost',
    port:5432,
    storage: "",
    dialect: "postgres",
    logging: false
})

export const accountSid = process.env.AccountSID;
export const authToken = process.env.AuthToken;
export const fromAdminPhone = process.env.fromAdminPhone;
export const APP_SECRET = process.env.APP_SECRET as string; 
export const FromAdminMail = process.env.FromAdminMail as string;
export const userSubject = process.env.usersubject as string;
export const GMAIL_USER = process.env.GMAIL_USER;
export const GMAIL_PASS = process.env.GMAIL_PASS;
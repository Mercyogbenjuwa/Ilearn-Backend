import express, { Request, Response } from "express";
import { Login, Register } from "../controller/userController";

const router = express.Router();

router.get("/user", (req:Request, res:Response) => {
    return res.status(200).json({
        message:"my landing page"
    })
})
router.post("/signup", Register);
router.post("/login", Login);

export default router;

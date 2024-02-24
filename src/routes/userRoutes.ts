import express from "express";
import { getUserInfo, patchUser, deleteUser, resetPassword } from "../controllers/userController";
import { authenticateToken } from "../middleware/authToken";

export const userRouter = express.Router();
userRouter
    .route("/personInfo")
    .get(authenticateToken, getUserInfo)
    .patch(authenticateToken, patchUser)
    .delete(authenticateToken, deleteUser);

userRouter.route("/reset_pass").patch(authenticateToken, resetPassword);

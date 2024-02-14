import express from "express";
import { loginController, registerController } from "../controllers/authController";
import * as CustomError from "../errors";

export const authRouter = express.Router();
authRouter.post("/login", loginController);
authRouter.post("/register", registerController);

authRouter.use((_req, _res, _next) => {
    _next(CustomError.ForbiddenError("Only POST requests are allowed"));
});
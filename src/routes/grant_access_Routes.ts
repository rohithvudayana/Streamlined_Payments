import express from "express"
import { authenticateToken } from "../middleware/authToken";
import { adminMiddleware } from "../middleware/isAdmin";

export const grant_accessRouter = express.Router();

grant_accessRouter
    .route("/admin_access/:userId")
    .post(authenticateToken, adminMiddleware, grant_accessRouter);

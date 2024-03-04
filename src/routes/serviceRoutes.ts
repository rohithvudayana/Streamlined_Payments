import express from "express";
import { deleteServiceId, getService, getServiceById, patchServiceId, postService } from "../controllers/serviceController";
import { authenticateToken } from "../middleware/authToken";
import { adminMiddleware } from "../middleware/isAdmin";

export const serviceRouter = express.Router();

serviceRouter.route("/service").post(authenticateToken, adminMiddleware, postService) .get(authenticateToken, adminMiddleware, getService);
serviceRouter.route("/service/:id").get(authenticateToken, getServiceById).patch(authenticateToken, adminMiddleware, patchServiceId)
                            .delete(authenticateToken, adminMiddleware, deleteServiceId)
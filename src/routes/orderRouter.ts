import express from "express";
import { getOrders, orderController } from "../controllers/orderController";
import { authenticateToken } from "../middleware/authToken";
import { adminMiddleware } from "../middleware/isAdmin";

export const orderRouter = express.Router();

orderRouter.route('/order').post(authenticateToken, orderController)
                            .get(authenticateToken, adminMiddleware, getOrders)
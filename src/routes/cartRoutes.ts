import express from "express";
import { authenticateToken } from "../middleware/authToken";
import { addCart, removeCart } from "../controllers/cartController";

export const cartRouter = express.Router();

cartRouter.route("/cart/:itemId/:cartType") .post(authenticateToken, addCart)
cartRouter.route("/cart/remove/:itemId/:cartType").post(authenticateToken, removeCart)
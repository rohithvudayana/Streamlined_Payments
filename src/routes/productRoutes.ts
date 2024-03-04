import express from  "express";
import { createProduct, deleteProductId, getProductId, getProducts, patchProductId } from "../controllers/productController";
import { authenticateToken } from "../middleware/authToken";
import { adminMiddleware } from "../middleware/isAdmin";

export const productRouter = express.Router();
productRouter.route("/product").get(authenticateToken, getProducts).post(authenticateToken, adminMiddleware, createProduct);
productRouter.route("/product/:id") .get(authenticateToken, getProductId) .patch(authenticateToken, adminMiddleware , patchProductId)
                                    .delete(authenticateToken, adminMiddleware, deleteProductId)
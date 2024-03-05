import express from "express";
import { authenticateToken } from "../middleware/authToken";
import { billController } from "../controllers/billController";

export const billRouter = express.Router();

billRouter.route("/totalbill")
            .get(authenticateToken, billController)
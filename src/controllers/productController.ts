import mongoose from "mongoose";
import { Request, Response, NextFunction} from "express";
import { asyncWrapper } from "../helpers";
import { StatusCodes } from "http-status-codes";
import * as CustomError from '../errors';

export const postProducts = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        const product = await _req.body;
        if(!product) return _next(CustomError.ForbiddenError)
    }
)
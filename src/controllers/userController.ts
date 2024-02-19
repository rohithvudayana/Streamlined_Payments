import mongoose from "mongoose";
import { User } from "../models/user";
import { StatusCodes } from "http-status-codes";
import { httpResponse } from "../helpers/createResponse";
import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../helpers/asyncWrapper";

const getUserInfo = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        const user = await User.aggregate([ 

        ])
    }
)
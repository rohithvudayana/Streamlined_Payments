import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncWrapper, httpResponse } from "../helpers";
import { User } from "../models/user";
import * as CustomError from "../errors";

export const grant_access = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        try{
            const {userId} = _req.params;
            const userToUpdate = await User.findById(userId);
            if(!userToUpdate){
                return _next(CustomError.BadRequestError("User not found"));
            }
            console.log(userToUpdate);
            if(userToUpdate.isAdmin === true) return _next(CustomError.BadRequestError("User is already an Admin"));
            userToUpdate.isAdmin = true;
            _res.status(StatusCodes.OK).json(httpResponse(true, "Admin access granted successfully", {}));
        }catch(error){
            _next(error);
        }
    }
)
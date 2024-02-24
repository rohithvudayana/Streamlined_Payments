import mongoose from "mongoose";
import { User } from "../models/user";
import { StatusCodes } from "http-status-codes";
import { httpResponse } from "../helpers/createResponse";
import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../helpers/asyncWrapper";
import * as CustomErrors from "../errors"
import { hashCompare } from "../helpers/hashPassword";
import { hashPassword } from "../helpers/hashPassword";
export const getUserInfo = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        const user = await User.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId((<any>_req).user.userId),
                },
            },
            {
                $project: {
                    __v: 0,
                    password: 0,
                },
            },
        ]);
        if(!user || user.length === 0){
            _next(CustomErrors.NotFoundError("uer not found"));
        }
        else{
            _res.status(StatusCodes.OK).json(httpResponse(true, "User info successfully retrieved", user[0]));
        }
    }
)

export const patchUser = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        const user = await User.findOneAndUpdate(
            {
                _id: (_req as any).user.userId,
            },
            [
                {
                    $set: _req.body,
                },
                {
                    $project:{
                        password: 0,
                        __v: 0,
                    },
                },
            ],
            {
                new : true,
            }
        );
        if(!user){
            _next(CustomErrors.NotFoundError("User not found"));
        }
        else{
            _res.status(StatusCodes.OK).json(httpResponse(true, "user updated", user));
        }
    }
)

export const deleteUser = async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
        const user = await User.deleteOne({ _id: (_req as any).user.userId });
        if (user.deletedCount !== 1) {
            _next(CustomErrors.NotFoundError("User not found"));
        } else {
            _res.status(StatusCodes.NO_CONTENT).json({ success: true, message: "User deleted" });
        }
    } catch (error) {
        _next(error); // Forward any caught error to the error handling middleware
    }
}

export const resetPassword = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        const user = await User.findOne({ _id : (<any>_req).user.userId });

        if(!user) return _next(CustomErrors.NotFoundError("User not found"));

        if(!_req.body.oldPassword || !_req.body.newPassword) return _next(CustomErrors.BadRequestError("Missing Password"));

        if(!hashCompare(_req.body.oldPassword, user.password ?? "")){
            return _next(CustomErrors.BadRequestError("Wrong Password"));
        }
        const hashedPassword = hashPassword(_req.body.newPassword);
        user.password = hashedPassword;
        await user.save();
        _res.status(StatusCodes.OK).json(httpResponse(true, "Password updated", {}));
    }
)
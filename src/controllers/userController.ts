import mongoose from "mongoose";
import { User } from "../models/user";
import { StatusCodes } from "http-status-codes";
import { httpResponse } from "../helpers/createResponse";
import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../helpers/asyncWrapper";
import * as CustomErrors from "../errors"
import { hashCompare } from "../helpers/hashPassword";

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
                _id: (<any>_req).user.user_Id,
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

export const deleteUser = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction) => {
        const user = await User.deleteOne({ _id : (<any>_req).user.userId});
        if(user.deletedCount !== 1){
            _next(CustomErrors.NotFoundError("User not Found"));
        }else{
            _res.status(StatusCodes.NO_CONTENT).json(httpResponse(true, "User deleted", {}));
        }
    }
)

export const resetPassword = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        const user = await User.findOne({ _id : (<any>_req).user.userId });

        if(!user) return _next(CustomErrors.NotFoundError("User not found"));

        if(!_req.body.oldPassword || !_req.body.newPassword) return _next(CustomErrors.BadRequestError("Missing Password"));

        if(!hashCompare(_req.body.oldPassword, user.password ?? "")){
            return _next(CustomErrors.BadRequestError("Wrong Password"));
        }
        user.password = _req.body.newPassword;
        await user.save();
        _res.status(StatusCodes.OK).json(httpResponse(true, "Password updated", {}));
    }
)
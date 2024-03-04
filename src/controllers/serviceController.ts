import mongoose from "mongoose";
import { Service } from "../models/service";
import { asyncWrapper, httpResponse } from "../helpers";
import {Request, Response, NextFunction } from "express";
import * as  CustomError from "../errors";
import { StatusCodes } from "http-status-codes";

export const postService = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        try{
            const serviceDet = await _req.body;
            if(!serviceDet.name || !serviceDet.price){
               return _next(CustomError.BadRequestError("Invalid service details"));
            }
            await Service.create(serviceDet);
            _res.status(StatusCodes.OK).json(httpResponse(true, "service created successfully", serviceDet));
        }catch(error){
            _next(error);
        }
    }
)

export const getService = asyncWrapper(
    async(_req: Request, _res:Response, _next: NextFunction) => {
        const page = Number(_req.body.PNO) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;
        try{
            const services = await Service.find({}, null, {skip , limit: perPage});
            if(!services){
                return _next(CustomError.NotFoundError("Service not found"));
            }
            _res.status(StatusCodes.OK).json(httpResponse(true, "services retrieved successfully", services));
        }catch(error){
            _next(error);
        }
    }
)

export const getServiceById = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
      const id = mongoose.Types.ObjectId.isValid(_req.params.id)
        ? new mongoose.Types.ObjectId(_req.params.id)
        : null;

      if (!id) {
        return _next (CustomError.BadRequestError("Invalid service ID"));
      }

      const service = await Service.findById(id);

      if (!service) {
        return _next (CustomError.NotFoundError("Service not found"));
      }
      _res.status(StatusCodes.OK).json(httpResponse(true, "Service retrieved successfully", service));
    } catch (error) {
      _next(error);
    }
  }
);

export const patchServiceId = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
      const id = mongoose.Types.ObjectId.isValid(_req.params.id) ? new mongoose.Types.ObjectId(_req.params.id) : null;
      if (!id) {
        return _next (CustomError.BadRequestError("Invalid service ID"));
      }
      const service = await Service.findById(id);
      if (!service) {
        return _next (CustomError.NotFoundError("Service not found"));
      }
      const updateData = _req.body;
      const updatedService = await Service.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { new: true }
      );
      if (!updatedService) {
       return _next(CustomError.NotFoundError("Service not found"));
      }
      _res.status(StatusCodes.OK).json(httpResponse(true, "Service updated successfully", updatedService));
    } catch (error) {
      _next(error);
    }
  }
);

export const deleteServiceId = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
      const id = mongoose.Types.ObjectId.isValid(_req.params.id) ? new mongoose.Types.ObjectId(_req.params.id) : null;
      if (!id) {
        return _next(CustomError.BadRequestError("Invalid service ID"));
      }
      const deletedService = await Service.findOneAndDelete({ _id: id });
      if (!deletedService) {
        return _next(CustomError.NotFoundError("Service not found"));
      }
      _res.status(StatusCodes.OK).json(httpResponse(true, "Service deleted successfully", {}));
    } catch (error) {
      _next(error);
    }
  }
);

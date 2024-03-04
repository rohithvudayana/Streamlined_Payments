import mongoose from "mongoose";
import { Request, Response, NextFunction} from "express";
import { asyncWrapper, httpResponse } from "../helpers";
import { StatusCodes } from "http-status-codes";
import * as CustomError from '../errors';
import { Product } from "../models/product";

export const createProduct = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction) => {
      try {
        const newProduct = _req.body;
        if(!newProduct.name ||!newProduct.price){
          return _next(CustomError.BadRequestError("enter all details"));
        }
        await Product.create(_req.body);
        _res.status(StatusCodes.CREATED).json(httpResponse(true, "Product created successfully", newProduct));
      } catch (error) {
        _next(error);
      }
    }
  );

export const getProducts = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        const page = Number(_req.body.PNO) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;
        try{
            const products = await Product.find({}, null, {skip , limit: perPage});
            if(!products || products.length === 0){
                _next(CustomError.NotFoundError("Products not found"));
            }
            _res.status(StatusCodes.OK).json(httpResponse(true, "products retrieved successfully", products));
        }catch(error){
            _next(error);
        }
    }
)

export const getProductId = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
      try{
        const id = mongoose.Types.ObjectId.isValid(_req.params.id) ? new mongoose.Types.ObjectId(_req.params.id) : null;
        if(!id){
          _next(CustomError.BadRequestError("Invalid Product ID"));
        }
        const ProductId = await Product.findById(_req.params.id);
        if(!ProductId){
          _next(CustomError.BadRequestError("product not found"));
        }
        _res.status(StatusCodes.OK).json(httpResponse(true, "product retrieved successfully", ProductId));
      }catch(error){
        _next(error);
      }
    }
)

export const patchProductId = asyncWrapper(
  async(_req: Request, _res: Response, _next: NextFunction) => {
    try{
      const id = mongoose.Types.ObjectId.isValid(_req.params.id) ? new mongoose.Types.ObjectId(_req.params.id) : null;
      if(!id) _next(CustomError.BadRequestError("Invalid ID"));
      const productId = await Product.findById(id);
      if(!productId) _next(CustomError.NotFoundError("Product not found"));
  
      const updateData = _req.body;
      const updateProductId = await Product.findOneAndUpdate(
        { _id : id },
        { $set : updateData},
        {new: true}
      )
      if(!updateProductId) _next(CustomError.NotFoundError("Product Not Found"));
      _res.status(StatusCodes.OK).json(httpResponse(true, "product updated successfully", updateProductId));
    }catch(error){
      _next(error);
    }
  }
)

export const deleteProductId = asyncWrapper(
  async(_req: Request, _res: Response, _next: NextFunction) => {
    try{
      const id = mongoose.Types.ObjectId.isValid(_req.params.id) ? new mongoose.Types.ObjectId(_req.params.id) : null;
      if(!id){
        _next(CustomError.BadRequestError("Invalid ID"));
      }
      const deleteProduct = await Product.findOneAndDelete({ _id: id})
      if(!deleteProduct){
        _next(CustomError.NotFoundError("Product not found"));
      }
      _res.status(StatusCodes.OK).json(httpResponse(true, "product deleted successfully", {}));
    }catch(error){
      _next(error);
    }
  }
)
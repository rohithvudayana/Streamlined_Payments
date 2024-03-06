import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import * as CustomError from "../errors";
import { asyncWrapper, httpResponse } from "../helpers";
import { User } from "../models/user";

export const addCart = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction) => {
      try {
        const { itemId, cartType } = _req.params;
        const user = await User.findById((<any>_req).user.userId);
        if (!user) {
          return _next(CustomError.NotFoundError("User not found"));
        }
        const existingItem = user.cart.find((cartItem) => cartItem.item?.toString() === itemId && cartItem.cartType === cartType);
        if (existingItem) {
          existingItem.quantity += _req.body.quantity || 1;
            // return _next(CustomError.BadRequestError("Item already in cart"));
        } else {
          const item = {
            item: itemId,
            cartType: cartType as "service" | "product",
            quantity: _req.body.quantity || 1,
          };
          user.cart.push(item);
        }
        await user.save();
        _res.status(StatusCodes.OK).json(httpResponse(true, "Item added successfully", { user }));
      } catch (error: any) {
        console.log('====================================');
        console.log(error.message);
        console.log('====================================');
        return _next(CustomError.InternalServerError("Error adding item to cart"));
      }
    }
  );

export const removeCart = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        try{
            const {itemId, cartType} = _req.params;
            console.log(itemId, cartType);
            const user = await User.findById((<any>_req).user.userId);
            if(!user){
                return _next(CustomError.NotFoundError("User not found"));
            }
            const existingItem = user.cart.find((cartItem) => cartItem.item?.toString() === itemId && cartItem.cartType === cartType);
            if(!existingItem){
                _res.status(StatusCodes.BAD_REQUEST).json({error : "item not found in the cart"});
                return ;
            }
            const itemIndex = user.cart.findIndex((item) => item.item?.toString() === itemId && item.cartType === cartType);
            console.log(itemIndex);
            user.cart.splice(itemIndex, 1);
            await user.save();
            _res.json(user);
        }catch(error: any){
            console.log("==============================");
            console.log(error.message);
            console.log("==============================");
            _res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Error removing item from cart"});
        }
    }
)
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as CustomError from "../errors";
import { asyncWrapper } from "../helpers";
import { User } from "../models/user";
import { Product } from "../models/product";
import { Service } from "../models/service";

const calculateTax  = (price: number, taxRate: number): number => {
    return (price * taxRate) / 100;
};
const calculateTotal = (items: any[]) : number => {
    let total = 0;
    for(const item of items){
        total += (item.price + item.tax) * item.quantity;
    }
    return total;
}
const calculateTaxRate = (cartType: string| undefined | null, price?: number): number => {
    if (!price) {
      return 0;
    }
    if (cartType === "Product") {
      if (price > 1000 && price <= 5000) {
        return 12;
      } else if (price > 5000) {
        return 18;
      }
    } else if (cartType === "Service") {
      if (price > 1000 && price <= 8000) {
        return 10;
      } else if (price > 8000) {
        return 15;
      }
    }
    return 0;
  };



export const billController = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        try{
            const user = await User.findById((<any>_req).user.userId);
            if(!user){
                return _next(CustomError.BadRequestError("User not found"));
            }
            if(user.cart.length === 0){
                return _next(CustomError.NotFoundError("cart is empty"));
            }
            const populateItems = async () => {
                try {
                    const populateProduct = Product.find({ _id: { $in: user.cart.map(item => item.item) } });
                    const populateService = Service.find({ _id: { $in: user.cart.map(item => item.item) } });
                    const [products, services] = await Promise.all([populateProduct, populateService]);

                    const itemMap = {};
                    for (const product of products) {
                      itemMap[product._id.toString()] = product;
                    }
                    for (const service of services) {
                      itemMap[service._id.toString()] = service;
                    }

                    const populatedCart = user.cart.map(item => {
                        const populatedItem = item.item ? itemMap[item.item.toString()] : undefined;
                        const taxRate = calculateTaxRate(item.cartType, populatedItem?.price);
                        return{
                            item: populatedItem,
                            quantity: item.quantity,
                            price: populatedItem?.price,
                            tax: populatedItem ? calculateTax(populatedItem.price, taxRate) : 0
                        }
                    });
                    return populatedCart;

                } catch (error) {
                  console.error("Error fetching items:", error);
                }
              };
        }catch(error){
            _res.status(500).json({error: "Error retrieving total bill"});
        }
    }
  )
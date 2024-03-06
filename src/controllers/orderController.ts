import { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../helpers";
import { StatusCodes } from "http-status-codes";
import * as CustomError from "../errors";
import { httpResponse } from "../helpers";
import { User } from "../models/user";
import { Order } from "../models/order";
import { Service } from "../models/service";
import { Product } from "../models/product";

const calculateTax  = (price: number, taxRate: number): number => {
    return (price * taxRate) / 100;
};
const calculateTotal = (items) : number => {
    let total = 0;
    for(const item of items){
        total += (item.price + item.tax) * item.quantity;
    }
    return total;
}
const calculateTaxRate = (cartType: string | undefined | null, price?: number): number => {
  if (!price) { return 0; }
  if (cartType === "product") {
    if (price <= 100) { return 12; }
    else { return 18; }
  }
  else if (cartType === "service") {
    if (price > 20000 && price <= 50000) {
      return 10;
    }
    else { return 15; }
  } else {
    console.warn("Invalid cart type:", cartType);
    return 0;
  }
};


export const orderController = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        try{
            const user = await User.findById((<any>_req).user.userId);
            if(!user){
                return _next(CustomError.BadRequestError("User not found"));
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
                    const orderDetails = user.cart.map(item => {
                        const populatedItem = item.item ? itemMap[item.item.toString()] : undefined;
                        const taxRate = calculateTaxRate(item.cartType, populatedItem?.price);
                        return{
                            item: populatedItem,
                            quantity: item.quantity,
                            cartType: item.cartType,
                            price: populatedItem?.price,
                            tax: populatedItem ? calculateTax(populatedItem.price, taxRate) : 0
                        }
                    });
                    return orderDetails;
                } catch (error) {
                  console.error("Error fetching items:", error);
                }
              };

              const finalCart = await populateItems();
              const totalAmount = calculateTotal(finalCart);
              const order = new Order({
                user: user._id,
                items: finalCart,
                totalAmount,
              })

              if(finalCart?.length === 0){
                return _next(CustomError.BadRequestError("your cart is empty ! add items first"));
              }
              await order.save();
              (user.cart as any) = []; // Not recommended for production code
              await user.save();
              _res.status(StatusCodes.OK).json(httpResponse(true, " Ordered Successfully", {order}));
        }catch(error){
            _res.status(500).json({error: "Error while creating an order"});
        }
    }
  )

  export const getOrders = asyncWrapper (
    async(_req: Request, _res: Response, _next: NextFunction) => {
      try{
        const orders =await Order.find();
        _res.status(StatusCodes.OK).json(httpResponse(true, "Orders Retrieved successfully", {orders}));
      }catch(error){
        _next(CustomError.InternalServerError("Error while Retrieving orders"));
      }
    }
  )
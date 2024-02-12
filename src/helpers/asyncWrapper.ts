import { promises } from "dns";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

type Callback = (
    _req : Request,
    _res: Response,
    _next: NextFunction
) => Promise<void>;

const asyncWrapper = (callback: Callback) => (
    async (_req: Request, _res: Response, _next: NextFunction) : Promise<void> => {
        try{
            await callback(_req, _res, _next);
        }catch(error: any){
            
        }
    }
)
    
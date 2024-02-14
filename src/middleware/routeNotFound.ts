import { Request, Response } from "express";
import { NotFoundError } from "../errors";

export const routeNotFound = (_req: Request, _res: Response) => {
    throw NotFoundError("Bad method or Route does not exist");
}
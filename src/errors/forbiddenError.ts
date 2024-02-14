import { StatusCodes } from "http-status-codes";
import { createCustomApiError } from "./customApiError";

function ForbiddenError(message : string){
    return createCustomApiError(message, StatusCodes.FORBIDDEN)
}

export {ForbiddenError} ;
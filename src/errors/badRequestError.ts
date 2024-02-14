import { createCustomApiError } from "./customApiError";
import { StatusCodes } from "http-status-codes";

function BadRequestError(message: string) {
  return new createCustomApiError(message, StatusCodes.BAD_REQUEST);
}

export { BadRequestError };

import type { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../controller/error-response";

export function exceptionMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  res
    .status(500)
    .send(new ErrorResponse("INTERNAL_SERVER_ERROR", "Internal server error"));
  res.locals.error = err;
  next();
}

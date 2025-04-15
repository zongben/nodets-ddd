/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response } from "express";
import { ErrorResponse } from "../controller/error-response";

export function exceptionMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: any,
) {
  console.error(err);

  res
    .status(500)
    .send(new ErrorResponse("INTERNAL_SERVER_ERROR", "Internal server error"));
}

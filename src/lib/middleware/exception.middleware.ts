/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response } from "express";
import { ErrorResponse } from "../controller/error-response";
import { logger } from "../logger/logger";

export function exceptionMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: any,
) {
  logger.error(err)
  res
    .status(500)
    .send(new ErrorResponse("INTERNAL_SERVER_ERROR", "Internal server error"));
}

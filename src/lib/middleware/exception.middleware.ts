/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response } from "express";
import { ErrorResponse } from "../controller/error-response";
import { ILogger } from "../bootstrap/interfaces/logger.interface";

export function exceptionMiddleware(logger: ILogger) {
  return (err: Error, _req: Request, res: Response, _next: any) => {
    logger.error(err);
    res.status(500).send(new ErrorResponse("INTERNAL_SERVER_ERROR", "Internal server error"));
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response } from "express";
import { ErrorBody } from "../controller/error-body";
import { ILogger } from "../logger";

export function exceptionMiddleware(logger: ILogger) {
  return (err: Error, _req: Request, res: Response, _next: any) => {
    logger.error(err);
    res.status(500).json(
      new ErrorBody({
        errorCode: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      }),
    );
  };
}

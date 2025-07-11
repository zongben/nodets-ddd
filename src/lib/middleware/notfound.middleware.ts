import type { Request, Response } from "express";
import { ErrorBody } from "../controller/error-body";
import { ILogger } from "../bootstrap/interfaces/logger.interface";

export function notFoundMiddleware(logger: ILogger) {
  return (req: Request, res: Response) => {
    logger.warn(`Not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json(
      new ErrorBody({
        errorCode: "NOT_FOUND",
        message: "Not found",
      }),
    );
  };
}

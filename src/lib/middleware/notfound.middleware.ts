import { ILogger } from "../bootstrap/interfaces/logger.interface";
import { ErrorResponse } from "../controller/error-response";
import type { Request, Response } from "express";

export function notFoundMiddleware(logger: ILogger) {
  return (req: Request, res: Response) => {
    logger.warn(`Not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json(new ErrorResponse("NOT_FOUND", "Not found"));
  };
}

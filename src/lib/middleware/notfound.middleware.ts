import { ILogger } from "../bootstrap/interfaces/logger.interface";
import { ErrorResponse } from "../controller/error-response";

export function notFoundMiddleware(logger: ILogger) {
  return (req: any, res: any) => {
    logger.warn(`Not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json(new ErrorResponse("NOT_FOUND", "Not found"));
  };
}

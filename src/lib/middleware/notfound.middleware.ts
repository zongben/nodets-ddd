import { ErrorResponse } from "../controller/error-response";

export function notFoundMiddleware(_req: any, res: any): void {
  res.status(404).send(new ErrorResponse("NOT_FOUND", "Not found"));
}

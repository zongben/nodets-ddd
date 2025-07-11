import { Request, Response, NextFunction } from "express";
import { DownloadResponse, JsonResponse } from "./responses";

export function action<T extends Request = any, U extends Response = any>(
  fn: (
    req: T,
    res: U,
    next: NextFunction,
  ) => Promise<JsonResponse | DownloadResponse | undefined>,
) {
  return async (req: T, res: U, next: NextFunction) => {
    const result = await fn(req, res, next);
    if (!result) {
      throw new Error(
        `No response returned from action ${req.method} ${req.path}`,
      );
    }
    if (result instanceof DownloadResponse) {
      res.download(result.filePath, result.fileName);
      return;
    }
    res.status(result.status).json(result.body);
  };
}

import type { Request, Response, NextFunction } from "express";

export function requestMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  console.log(`${req.method} ${req.url}`);
  next();
}

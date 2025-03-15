import type { Request, Response, NextFunction } from "express";

export function exceptionMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);
  res.status(500).send("Internal Server Error");
  next();
}

import type { Request, Response } from "express";

export function logMiddleware(
  req: Request,
  res: Response,
) {
  const dt = new Date().toISOString();
  const err = res.locals.error ?? '';
  console.log(`${dt} ${res.statusCode} ${req.method} ${req.url} ${err}`);
}

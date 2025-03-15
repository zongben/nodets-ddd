import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function jwtValidHandler(secret: string) {
  console.log("secret ", secret);
  return (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      res.status(401).send("Unauthorized");
      return;
    }
    token = token.slice(7, token.length);
    try {
      const payload = jwt.verify(token, secret);
      res.locals.jwt = payload;
      next();
    } catch {
      res.status(401).send("Unauthorized");
      return;
    }
  };
}

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function jwtValidHandler(secret: string) {
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
    } catch (err) {
      res.status(401).send("Unauthorized");
      return;
    }
  };
}

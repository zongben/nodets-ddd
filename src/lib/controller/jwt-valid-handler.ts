import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ErrorBody } from "./error-body";

export function jwtValidHandler(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      res.status(401).json(
        new ErrorBody({
          errorCode: "UNAUTHORIZED",
          message: "Unauthorized",
        }),
      );
      return;
    }
    token = token.slice(7, token.length);
    try {
      const payload = jwt.verify(token, secret);
      res.locals.jwt = payload;
      next();
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        res.status(401).json(
          new ErrorBody({
            errorCode: "TOKEN_EXPIRED",
            message: "Token expired",
          }),
        );
        return;
      }
      res.status(401).json(
        new ErrorBody({
          errorCode: "UNAUTHORIZED",
          message: "Unauthorized",
        }),
      );
      return;
    }
  };
}

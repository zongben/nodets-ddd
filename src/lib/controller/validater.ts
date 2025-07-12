import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import type { ExpressMiddleware } from "./decorator/controller.decorator";

export const validate = (chains: ValidationChain[]): ExpressMiddleware => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const chain of chains) {
      await chain.run(req);
    }
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json(errs.array().map((x) => x.msg));
    }
    next();
  };
};

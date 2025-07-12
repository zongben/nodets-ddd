import { Request, Response, NextFunction } from "express";
import {
  validationResult,
  ValidationChain,
  ValidationError,
} from "express-validator";
import type { ExpressMiddleware } from "./decorator/controller.decorator";

export const validate = <T = any>(
  chains: ValidationChain[],
  options?: {
    status?: number;
    handler?: (errors: ValidationError[]) => T;
  },
): ExpressMiddleware => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const chain of chains) {
      await chain.run(req);
    }
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res
        .status(options?.status ?? 400)
        .json(
          options?.handler
            ? options.handler(errs.array())
            : errs.array().map((x) => x.msg),
        );
    }
    next();
  };
};

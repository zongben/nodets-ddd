import { validationResult } from "express-validator";
import { ExpressMiddleware } from "./decorator/controller.decorator";
import { Ruler } from "./ruler";

export const validate = <T = any>(
  rule: new () => Ruler<T>,
): ExpressMiddleware[] => {
  return [
    new rule() as any,
    (req: any, res: any, next: any) => {
      const errs = validationResult(req);
      if (!errs.isEmpty()) {
        res.status(400).json(errs.array().map((x) => x.msg));
        return;
      }
      next();
    },
  ];
};

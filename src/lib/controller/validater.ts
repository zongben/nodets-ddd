import { validationResult } from "express-validator";
import { ExpressMiddleware } from "./decorator/controller.decorator";

export const validate = (rule: any): ExpressMiddleware[] => {
  return [
    rule,
    (req: any, res: any, next: any) => {
      const errs = validationResult(req);
      if (!errs.isEmpty()) {
        res.status(400).json(errs.array()[0].msg);
        return;
      }
      next();
    },
  ];
};

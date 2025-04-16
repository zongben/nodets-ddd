import { NextFunction, Router } from "express";
import { inject, injectable } from "inversify";
import { validationResult } from "express-validator";
import { MEDIATOR_TYPES } from "../mediator/types";
import { ISender } from "../mediator/interfaces/sender.interface";
import { IEnv } from "./interfaces/env.interface";
import { IBaseResponse } from "./interfaces/base-response.interface";

@injectable()
export abstract class BaseController {
  protected router: Router = Router();
  abstract apiPath: string;
  abstract mapRoutes(): Router;

  constructor(
    @inject(MEDIATOR_TYPES.ISender) protected readonly _sender: ISender,
    @inject(Symbol.for("env")) protected readonly _env: IEnv,
  ) {}

  private _asyncWrapper(fn: any) {
    return (req: any, res: any, next: any) => {
      Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };
  }

  action(fn: (req: any, res: any, next: any) => Promise<IBaseResponse | void>) {
    return this._asyncWrapper(async (req: any, res: any, next: any) => {
      const result = await fn.bind(this)(req, res, next);
      if (!result)
        throw new Error(`No response from action ${req.method} ${req.path}`);
      res.status(result.status).send(result.body);
    });
  }

  validate(rule: any) {
    return [
      rule,
      (req: any, res: any, next: NextFunction) => {
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          res.status(400).send(errs.array()[0].msg);
          return;
        }
        next();
      },
    ];
  }
}

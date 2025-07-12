import { NextFunction, Request, Response } from "express";

export const CONTROLLER_METADATA = {
  PATH: Symbol("controller_path"),
  MIDDLEWARE: Symbol("controller_middleware"),
};

export type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export function Controller(
  path: string,
  ...middleware: ExpressMiddleware[]
): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(CONTROLLER_METADATA.PATH, path, target);
    Reflect.defineMetadata(CONTROLLER_METADATA.MIDDLEWARE, middleware, target);
  };
}

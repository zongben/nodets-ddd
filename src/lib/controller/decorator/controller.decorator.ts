import { NextFunction } from "express";

export const ROUTE_METADATA_KEY = Symbol("route_metadata");

export interface RouteDefinition {
  method: "get" | "post" | "put" | "delete" | "patch";
  path: string;
  handlerName: string;
  middleware?: ExpressMiddleware[];
}

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

function createRouteDecorator(method: RouteDefinition["method"]) {
  return (
    path: string,
    ...middleware: ExpressMiddleware[]
  ): MethodDecorator => {
    return (target, propertyKey) => {
      const routes: RouteDefinition[] =
        Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || [];

      routes.push({
        method,
        path,
        handlerName: propertyKey as string,
        middleware,
      });

      Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, target.constructor);
    };
  };
}

export const Get = createRouteDecorator("get");
export const Post = createRouteDecorator("post");
export const Put = createRouteDecorator("put");
export const Delete = createRouteDecorator("delete");
export const Patch = createRouteDecorator("patch");

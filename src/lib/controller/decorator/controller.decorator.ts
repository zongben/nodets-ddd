import { NextFunction, Request, Response } from "express";
import {
  ExtendWith,
  FileResponse,
  JsonResponse,
  ResponseWith,
} from "../responses";

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

function applyWithData(res: Response, withData: ResponseWith = {}) {
  if (withData.headers) {
    for (const [key, value] of Object.entries(withData.headers)) {
      res.setHeader(key, value);
    }
  }

  if (withData.cookies) {
    for (const cookie of withData.cookies) {
      res.cookie(cookie.key, cookie.value, cookie.options);
    }
  }
}

function createRouteDecorator(method: RouteDefinition["method"]) {
  return (
    path: string,
    ...middleware: ExpressMiddleware[]
  ): MethodDecorator => {
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
      const original = descriptor.value;

      descriptor.value = async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ) {
        try {
          const paramMeta: ParamMetadata[] =
            Reflect.getMetadata(PARAM_METADATA_KEY, target, propertyKey) || [];

          const args: any[] = [];
          for (let i = 0; i < original.length; i++) {
            const meta = paramMeta.find((p) => p.index === i);

            if (!meta) {
              args[i] = undefined;
              continue;
            }

            let rawValue: any;
            switch (meta.source) {
              case "body":
                rawValue = req.body;
                break;
              case "query":
                rawValue = req.query;
                break;
              case "param":
                rawValue = req.params;
                break;
              case "locals":
                rawValue = res.locals;
                break;
              case "req":
                rawValue = req;
                break;
              case "res":
                rawValue = res;
                break;
              default:
                rawValue = undefined;
            }

            if (meta.name) {
              args[i] = rawValue[meta.name];
            } else {
              args[i] = rawValue;
            }
          }

          const result = await original.apply(this, args);

          if (res.headersSent) return;
          if (!result) {
            throw new Error(
              `No response returned from action ${req.method} ${req.path}`,
            );
          }

          if (result instanceof ExtendWith) {
            applyWithData(res, result.getWithData());
          }

          if (result instanceof FileResponse) {
            return res.download(result.filePath, result.fileName);
          }
          if (result instanceof JsonResponse) {
            return res.status(result.status).json(result.body);
          }
        } catch (err) {
          next(err);
        }
      };

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

const PARAM_METADATA_KEY = Symbol("param_metadata");
type ParamSource = "body" | "query" | "param" | "locals" | "req" | "res";

interface ParamMetadata {
  index: number;
  source: ParamSource;
  name?: string;
}

function createParamDecorator(source: ParamSource) {
  return function (name?: string): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
      const existingParams: ParamMetadata[] =
        Reflect.getMetadata(PARAM_METADATA_KEY, target, propertyKey as any) ||
        [];

      existingParams.push({
        index: parameterIndex,
        source,
        name,
      });

      Reflect.defineMetadata(
        PARAM_METADATA_KEY,
        existingParams,
        target,
        propertyKey as any,
      );
    };
  };
}

export const Body = createParamDecorator("body");
export const Query = createParamDecorator("query");
export const Param = createParamDecorator("param");
export const Locals = createParamDecorator("locals");
export const Req = createParamDecorator("req");
export const Res = createParamDecorator("res");

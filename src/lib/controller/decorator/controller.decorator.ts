import { NextFunction, Request, Response } from "express";
import { FileResponse, JsonResponse } from "../responses";

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
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
      const original = descriptor.value;

      descriptor.value = async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ) {
        try {
          // 讀取參數 metadata
          const paramMeta: ParamMetadata[] =
            Reflect.getMetadata(PARAM_METADATA_KEY, target, propertyKey) || [];

          // 依參數 index 組裝 arguments
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
              default:
                rawValue = undefined;
            }

            if (meta.type) {
              // 建立類別實例並 assign 值
              args[i] = Object.assign(new meta.type(), rawValue);
            } else {
              args[i] = rawValue;
            }
          }

          // 呼叫原本 handler
          const result = await original.apply(this, args);
          // 若 response 已送出，直接返回
          if (res.headersSent) return;

          if (!result) {
            throw new Error(
              `No response returned from action ${req.method} ${req.path}`,
            );
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

      // 取得並更新 routes metadata
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
type ParamSource = "body" | "query" | "param" | "locals";

interface ParamMetadata {
  index: number;
  source: ParamSource;
  type?: new (...args: any[]) => any;
}

function createParamDecorator(source: ParamSource) {
  return function (type?: new (...args: any[]) => any): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
      const existingParams: ParamMetadata[] =
        Reflect.getMetadata(PARAM_METADATA_KEY, target, propertyKey as any) ||
        [];

      existingParams.push({
        index: parameterIndex,
        source,
        type,
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

import express from "express";
import "reflect-metadata";
import { Container } from "inversify";
import { AppOptions } from "./app-options";
import { BaseController } from "../controller/base-controller";
import { Env } from "./env";
import { Module } from "../container/container.module";
import { logger } from "../logger/logger";

export class App {
  private _app: express.Application;
  env: Env;
  serviceContainer: Container;
  options: AppOptions;

  private constructor(options: AppOptions) {
    this.env = new Env(options.envPath);
    this._app = express();
    this.options = options;
    this.serviceContainer = new Container(options.container);
    this.options.allowAnonymousPath = this.options.allowAnonymousPath.map(
      (p) => {
        return {
          path: `${this.options.routerPrefix}${p.path}`.toLowerCase(),
          method: p.method.toUpperCase(),
        };
      },
    );
    this.serviceContainer.bind(Symbol.for("env")).toConstantValue(this.env);
  }

  static createBuilder(fn: (options: AppOptions) => void = () => {}) {
    const options = new AppOptions();
    fn(options);
    return new App(options);
  }

  loadModules(...modules: Module[]) {
    this.serviceContainer.load(
      ...modules.map((m) => {
        return m.getModule();
      }),
    );
    return this;
  }

  mapController(controllers: Array<new (...args: any[]) => BaseController>) {
    controllers.forEach((c) => {
      const _ctor = this.serviceContainer.resolve(c);
      this._app.use(
        `${this.options.routerPrefix}${_ctor.apiPath}`.toLowerCase(),
        _ctor.mapRoutes(),
      );
    });
    return this;
  }

  useMiddleware(middleware: any) {
    this._app.use(middleware);
    return this;
  }

  useJwtValidMiddleware(handler: (req: any, res: any, next: any) => void) {
    this._app.use((req, res, next) => {
      const isAnonymous = this.options.allowAnonymousPath.some(
        (x) => req.url.match(x.path) && req.method.match(x.method),
      );

      if (isAnonymous) {
        next();
      } else {
        handler(req, res, next);
      }
    });
    return this;
  }

  useJsonParser() {
    this._app.use(express.json());
    return this;
  }

  addHeaders(...headers: Record<string, string>[]) {
    this._app.use((_req, res, next) => {
      headers.forEach((header) => {
        Object.keys(header).forEach((key) => {
          res.setHeader(key, header[key]);
        });
      });
      next();
    });
    return this;
  }

  run() {
    logger.info(`NODE_ENV: ${this.env.get("NODE_ENV")}`);
    const port = Number(this.env.get("PORT")) || 3000;
    this._app.listen(port, () => {
      logger.info(
        `Listening on port localhost:${port}${this.options.routerPrefix}`,
      );
    });
  }
}

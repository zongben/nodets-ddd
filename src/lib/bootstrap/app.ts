import express from "express";
import "reflect-metadata";
import { Container } from "inversify";
import { AppOptions } from "./app-options";
import { BaseController } from "../controller/base-controller";
import { Env } from "./env";
import { Module } from "../container/container.module";
import { Logger } from "./logger";
import { IEnv } from "../controller/interfaces/env.interface";
import { APP_TYPES } from "./types";
import http from "http";
import { Socket } from "net";
import cors from "cors";
import bodyParser from "body-parser";
import { ILogger } from "./interfaces/logger.interface";

export class App {
  private _app: express.Application;
  private _server?: http.Server;
  private _connections: Set<Socket>;
  logger: ILogger;
  env!: Env;
  serviceContainer: Container;
  options: AppOptions;

  private constructor(options: AppOptions) {
    this.options = options;
    this._app = express();
    this._connections = new Set<Socket>();
    this.logger = new Logger();
    this.serviceContainer = new Container(this.options.container);
    this.options.allowAnonymousPath = this.options.allowAnonymousPath.map(
      (p) => {
        return {
          path: `${this.options.routerPrefix}${p.path}`.toLowerCase(),
          method: p.method.toUpperCase(),
        };
      },
    );
    this._bindLogger();
  }

  static createBuilder(fn: (options: AppOptions) => void = () => {}) {
    const options = new AppOptions();
    fn(options);
    return new App(options);
  }

  useDotEnv(path: string) {
    this.env = new Env(path);
    this.serviceContainer.bind<IEnv>(APP_TYPES.IEnv).toConstantValue(this.env);
    this.logger.info(`Dotenv is loaded from ${path}`);
  }

  useLogger(logger: ILogger) {
    this.logger = logger;
    this._bindLogger();
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
      const isAnonymous = this.options.allowAnonymousPath.some((x) => {
        const methodMatch = new RegExp(x.method).test(req.method);
        const pathMatch = new RegExp(
          "^" + x.path.replace(/\*/g, ".*").replace(/\//g, "\\/"),
          "i",
        ).test(req.path);
        return methodMatch && pathMatch;
      });

      if (isAnonymous) {
        next();
      } else {
        handler(req, res, next);
      }
    });
    return this;
  }

  useJsonParser(options?: bodyParser.OptionsJson) {
    this._app.use(express.json(options));
    return this;
  }

  useUrlEncodedParser(options?: bodyParser.OptionsUrlencoded) {
    this._app.use(express.urlencoded(options));
    return this;
  }

  useCors(options: cors.CorsOptions) {
    this._app.use(cors(options));
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
    const port = Number(this.env?.get("PORT")) || 3000;
    this._server = this._app.listen(port, () => {
      this.logger.info(`Listening on port ${port}`);
    });

    this._server.on("connection", (conn) => {
      this._connections.add(conn);
      conn.on("close", () => {
        this._connections.delete(conn);
      });
    });

    process.on("SIGINT", this._gracefulShutdown.bind(this));
    process.on("SIGTERM", this._gracefulShutdown.bind(this));
  }

  private _bindLogger() {
    this.serviceContainer
      .bind<ILogger>(APP_TYPES.ILogger)
      .toConstantValue(this.logger);
  }

  private _gracefulShutdown() {
    this.logger.info("Starting graceful shutdown...");

    this._server?.close(() => {
      this.logger.info("Closed server, exiting process.");
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    });

    setTimeout(() => {
      this.logger.info("Forcing close of connections...");
      this._connections.forEach((conn) => conn.destroy());
    }, 30_000);
  }
}

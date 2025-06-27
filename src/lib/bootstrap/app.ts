import express from "express";
import "reflect-metadata";
import { Container } from "inversify";
import { AppOptions } from "./app-options";
import { BaseController } from "../controller/base-controller";
import { Env } from "./env";
import { Module } from "../container/container.module";
import { Logger } from "./logger";
import { ILogger } from "./interfaces/logger.interface";
import { IEnv } from "../controller/interfaces/env.interface";
import { APP_TYPES } from "./types";
import http from "http";
import { Socket } from "net";

export class App {
  private _app: express.Application;
  private _server: http.Server;
  private _connections: Set<Socket>;
  logger: ILogger;
  env: Env;
  serviceContainer: Container;
  options: AppOptions;

  private constructor(options: AppOptions) {
    this.options = options;
    this.env = new Env(this.options.envPath);

    this._app = express();
    this._server = http.createServer(this._app);
    this._connections = new Set<Socket>();

    this.logger = new Logger(
      this.env.get("NODE_ENV"),
      this.options.loggerOptions,
    );
    this.logger.info(`Dotenv is loaded from ${this.options.envPath}`);

    this.serviceContainer = new Container(this.options.container);
    this.options.allowAnonymousPath = this.options.allowAnonymousPath.map(
      (p) => {
        return {
          path: `${this.options.routerPrefix}${p.path}`.toLowerCase(),
          method: p.method.toUpperCase(),
        };
      },
    );
    this.serviceContainer.bind<IEnv>(APP_TYPES.IEnv).toConstantValue(this.env);
    this.serviceContainer
      .bind<ILogger>(APP_TYPES.ILogger)
      .toConstantValue(this.logger);
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
    this.logger.info(`NODE_ENV: ${this.env.get("NODE_ENV")}`);
    const port = Number(this.env.get("PORT")) || 3000;
    this._app.listen(port, () => {
      this.logger.info(`Listening on port ${port}`);
    });

    this._server.on("connection", (conn) => {
      this._connections.add(conn);
      conn.on("close", () => {
        this._connections.delete(conn);
      });
    });

    process.on("SIGINT", this.gracefulShutdown.bind(this));
    process.on("SIGTERM", this.gracefulShutdown.bind(this));
  }

  private gracefulShutdown() {
    this.logger.info("Starting graceful shutdown...");

    this._server.close(() => {
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

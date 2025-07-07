import { interfaces } from "inversify";
import { AllowAnonymousPath } from "./allowAnonymous-path.type";
import DailyRotateFile from "winston-daily-rotate-file";
import { Env } from "./env";

export class AppOptions {
  routerPrefix: string = "/api";
  container?: interfaces.ContainerOptions = {
    autoBindInjectable: true,
  };
  allowAnonymousPath: AllowAnonymousPath[] = [];
  envPath: string = "";
  loggerOptions: DailyRotateFile.DailyRotateFileTransportOptions = {
    filename: `./log/%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  };
  loggerlevel: string = "info";
  onEnvInitialized?: (env: Env) => void;
}

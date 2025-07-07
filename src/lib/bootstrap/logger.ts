import winston from "winston";
import "dotenv/config";
import "winston-daily-rotate-file";
import { ILogger } from "./interfaces/logger.interface";
import { injectable } from "inversify";
import DailyRotateFile from "winston-daily-rotate-file";

export enum LOGGER_LEVEL {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

@injectable()
export class Logger implements ILogger {
  private logger: winston.Logger;

  constructor(
    level: string,
    options: DailyRotateFile.DailyRotateFileTransportOptions,
  ) {
    if (!level) {
      throw new Error("level is required");
    }

    const transport = new winston.transports.DailyRotateFile(options);

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}] ${message}`;
        }),
      ),
      level,
      transports: [transport, new winston.transports.Console()],
    });
  }

  error(err: Error) {
    this.logger.error(err.stack || err.message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  info(message: string) {
    this.logger.info(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}

import winston from "winston";
import "dotenv/config";
import "winston-daily-rotate-file";
import { ILogger } from "./interfaces/logger.interface";
import { injectable } from "inversify";

@injectable()
export class Logger implements ILogger {
  private logger: winston.Logger;

  constructor(env: string) {
    if (!env) {
      throw new Error("env is required");
    }

    const transport = new winston.transports.DailyRotateFile({
      filename: `./log/%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    });

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
      level: env === "dev" ? "debug" : "info",
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

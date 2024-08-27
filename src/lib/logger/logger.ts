import winston from "winston";
import "dotenv/config";

class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    });
  }

  private setOptions() {
    const env = process.env.NODE_ENV!;
    const level = env === "dev" ? "debug" : "info";
    const today = new Date()
      .toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");

    const transport =
      env === "dev"
        ? new winston.transports.Console()
        : new winston.transports.File({ filename: `./log/${today}.log` });

    this.logger.level = level;
    this.logger.clear();
    this.logger.add(transport)
  }

  error(err: Error) {
    this.setOptions();
    this.logger.error(err.stack || err.message);
  }

  warn(message: string) {
    this.setOptions();
    this.logger.warn(message);
  }

  info(message: string) {
    this.setOptions();
    this.logger.info(message);
  }

  debug(message: string) {
    this.setOptions();
    this.logger.debug(message);
  }
}

export const logger = new Logger();

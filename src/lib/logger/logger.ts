import winston from "winston";
import "dotenv/config";

export class Logger {
  private logger: winston.Logger;

  constructor() {
    const env = process.env.NODE_ENV!;
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

    this.logger = winston.createLogger({
      level: env === "dev" ? "debug" : "info",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
      transports: [transport],
    });
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  info(message: string) {
    this.logger.info(message);
  }

  http(message: string) {
    this.logger.http(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}

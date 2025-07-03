import { ILogger } from "../bootstrap/interfaces/logger.interface";
import { performance } from "node:perf_hooks";
import onFinished from "on-finished";

export function timerMiddleware(logger: ILogger) {
  return (req: any, res: any, next: any) => {
    const start = performance.now();

    onFinished(res, () => {
      const end = performance.now();
      const duration = end - start;
      if (duration > 1000) {
        logger.warn(
          `Slow request: ${req.method} ${req.originalUrl} - Duration: ${duration.toFixed(2)} ms`,
        );
      } else {
        logger.debug(
          `Request: ${req.method} ${req.originalUrl} - Duration: ${duration.toFixed(2)} ms`,
        );
      }
    });

    next();
  };
}

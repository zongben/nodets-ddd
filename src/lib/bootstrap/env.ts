import dotenv from "dotenv";
import { IEnv } from "../controller/interfaces/env.interface";
import { logger } from "../logger/logger";

export class Env implements IEnv {
  private _env

  constructor(path: string) {
    logger.info(`Loading environment variables from "${path}"`);
    dotenv.config({ path });
    this._env = process.env;
  }

  get(key: string): any {
    const value = this._env[key];
    if (!value) {
      console.warn(`Environment variable "${key}" not found`);
      return undefined;
    }
    return value;
  }
}

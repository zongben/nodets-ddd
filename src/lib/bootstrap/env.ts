import dotenv from "dotenv";
import { IEnv } from "../controller/interfaces/env.interface";

export class Env implements IEnv {
  private _env

  constructor(path: string) {
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

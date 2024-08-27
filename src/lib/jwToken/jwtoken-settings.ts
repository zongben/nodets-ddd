import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import { IJwTokenSettings } from "./interfaces/jwtoken-settings.interface";

@injectable()
export abstract class JwTokenSettings implements IJwTokenSettings {
  secret: string;
  options?: jwt.SignOptions;

  constructor(secret: string, options?: jwt.SignOptions) {
    this.secret = secret;
    this.options = options;
  }
}

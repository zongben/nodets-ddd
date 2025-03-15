import { injectable } from "inversify";
import jwt from "jsonwebtoken";

@injectable()
export class JwTokenSettings {
  secret: string;
  options?: jwt.SignOptions;

  constructor(secret: string, options?: jwt.SignOptions) {
    this.secret = secret;
    this.options = options;
  }
}

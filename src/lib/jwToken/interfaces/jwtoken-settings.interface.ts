import jwt from "jsonwebtoken";

export interface IJwTokenSettings {
  secret: string;
  options?: jwt.SignOptions;
}

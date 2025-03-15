import { body } from "express-validator";
import { Ruler } from "../../ruler";
import { LoginReq } from "./login-req";
import { INVALID_MESSAGE } from "../../invalid-message";

export const loginRule = new Ruler<LoginReq>((req) => [
  body(req("account")).notEmpty().withMessage(INVALID_MESSAGE.ACCOUNT_IS_REQUIRED),
  body(req("password")).notEmpty().withMessage(INVALID_MESSAGE.PASSWORD_IS_REQUIRED),
]);

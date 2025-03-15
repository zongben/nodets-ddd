import { body } from "express-validator";
import { Ruler } from "../../ruler";
import { RegisterReq } from "./register-req";
import { INVALID_MESSAGE } from "../../invalid-message";

export const registerRule = new Ruler<RegisterReq>((req) => [
  body(req("account")).notEmpty().withMessage(INVALID_MESSAGE.ACCOUNT_IS_REQUIRED),
  body(req("password"))
    .notEmpty()
    .withMessage(INVALID_MESSAGE.PASSWORD_IS_REQUIRED)
    .isLength({ min: 6 })
    .withMessage(INVALID_MESSAGE.PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS),
  body(req("username")).notEmpty().withMessage(INVALID_MESSAGE.USERNAME_IS_REQUIRED),
]);

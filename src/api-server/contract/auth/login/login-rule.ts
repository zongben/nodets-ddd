import { body } from "express-validator";
import { INVALID_CODES } from "../../invalid-codes";
import { Ruler } from "../../../../lib/controller/ruler";
import { LoginReq } from "./login-req.type";

export class LoginRule extends Ruler<LoginReq> {
  constructor() {
    super((req) => [
      body(req("account"))
        .notEmpty()
        .withMessage(INVALID_CODES.ACCOUNT_IS_REQUIRED),
      body(req("password"))
        .notEmpty()
        .withMessage(INVALID_CODES.PASSWORD_IS_REQUIRED),
    ]);
  }
}

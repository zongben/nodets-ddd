import { body } from "express-validator";
import { INVALID_MESSAGE } from "../../invalid-message";
import { Ruler } from "../../../../lib/controller/ruler";
import { LoginReq } from "./login-req.type";

export class LoginRule extends Ruler<LoginReq> {
  constructor() {
    super((req) => [
      body(req("account"))
        .notEmpty()
        .withMessage(INVALID_MESSAGE.ACCOUNT_IS_REQUIRED),
      body(req("password"))
        .notEmpty()
        .withMessage(INVALID_MESSAGE.PASSWORD_IS_REQUIRED),
    ]);
  }
}

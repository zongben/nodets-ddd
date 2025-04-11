import { body } from "express-validator";
import { INVALID_CODES } from "../../invalid-codes";
import { Ruler } from "../../../../lib/controller/ruler";
import { RegisterReq } from "./register-req.type";

export class RegisterRule extends Ruler<RegisterReq> {
  constructor() {
    super((req) => [
      body(req("account"))
        .notEmpty()
        .withMessage(INVALID_CODES.ACCOUNT_IS_REQUIRED),
      body(req("password"))
        .notEmpty()
        .withMessage(INVALID_CODES.PASSWORD_IS_REQUIRED)
        .isLength({ min: 6 })
        .withMessage(INVALID_CODES.PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS),
      body(req("username"))
        .notEmpty()
        .withMessage(INVALID_CODES.USERNAME_IS_REQUIRED),
    ]);
  }
}

import { body } from "express-validator";
import { INVALID_CODES } from "../../invalid-codes";
import { Ruler } from "../../../../lib/controller/ruler";
import { ErrorResponse } from "../../../../lib/controller/error-response";

export type LoginReq = {
  account: string;
  password: string;
};

export class LoginRule extends Ruler<LoginReq> {
  constructor() {
    super((req) => [
      body(req("account"))
        .notEmpty()
        .withMessage(
          new ErrorResponse(
            INVALID_CODES.ACCOUNT_IS_REQUIRED,
            "Account is required",
          ),
        ),
      body(req("password"))
        .notEmpty()
        .withMessage(
          new ErrorResponse(
            INVALID_CODES.PASSWORD_IS_REQUIRED,
            "Password is required",
          ),
        ),
    ]);
  }
}

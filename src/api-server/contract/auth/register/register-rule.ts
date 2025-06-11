import { body } from "express-validator";
import { INVALID_CODES } from "../../invalid-codes";
import { Ruler } from "../../../../lib/controller/ruler";
import { ErrorResponse } from "../../../../lib/controller/error-response";

export type RegisterReq = {
  account: string;
  password: string;
  username: string;
};

export class RegisterRule extends Ruler<RegisterReq> {
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
        )
        .isLength({ min: 6 })
        .withMessage(
          new ErrorResponse(
            INVALID_CODES.PASSWORD_IS_TOO_SHORT,
            "Password must be at least 6 characters long",
          ),
        ),
      body(req("username"))
        .notEmpty()
        .withMessage(
          new ErrorResponse(
            INVALID_CODES.USERNAME_IS_REQUIRED,
            "Username is required",
          ),
        ),
    ]);
  }
}

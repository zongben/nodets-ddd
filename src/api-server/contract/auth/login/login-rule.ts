import { body } from "express-validator";
import { INVALID_CODES } from "../../invalid-codes";
import { Ruler } from "../../../../lib/controller/ruler";
import { ErrorBody } from "../../../../lib/controller/error-body";

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
          new ErrorBody({
            errorCode: INVALID_CODES.ACCOUNT_IS_REQUIRED,
            message: "Account is required",
          }),
        ),
      body(req("password"))
        .notEmpty()
        .withMessage(
          new ErrorBody({
            errorCode: INVALID_CODES.PASSWORD_IS_REQUIRED,
            message: "Password is required",
          }),
        ),
    ]);
  }
}

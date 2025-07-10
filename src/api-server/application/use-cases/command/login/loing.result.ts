import { ErrorCodes } from "../../../error-codes";
import { FailReturn } from "../../../fail-return";

export type LoginResult = {
  accessToken: string;
  refreshToken: string;
};

export class LoginFailError extends FailReturn {
  constructor() {
    super(ErrorCodes.ACCOUNT_OR_PASSWORD_INCORRECT);
  }
}

import { FailReturn } from "../../../fail-return";
import { CODES } from "../../../codes";

export class LoginFailError extends FailReturn {
  constructor() {
    super(CODES.ACCOUNT_OR_PASSWORD_INCORRECT);
  }
}

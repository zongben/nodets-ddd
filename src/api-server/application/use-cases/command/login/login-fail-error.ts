import { FailReturn } from "../../../fail-return";
import { MESSAGE_CODES } from "../../../message-codes";

export class LoginFailError extends FailReturn {
  constructor() {
    super(MESSAGE_CODES.ACCOUNT_OR_PASSWORD_INCORRECT);
  }
}

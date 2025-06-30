import { FailReturn } from "../../../fail-return";
import { MESSAGE_CODES } from "../../../message-codes";

export class UserExistError extends FailReturn {
  constructor() {
    super(MESSAGE_CODES.USER_ALREADY_EXISTS);
  }
}

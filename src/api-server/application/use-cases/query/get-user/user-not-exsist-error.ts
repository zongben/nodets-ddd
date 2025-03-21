import { FailReturn } from "../../../fail-return";
import { MESSAGE_CODES } from "../../../message-codes";

export class UserNotExsistError extends FailReturn {
  constructor() {
    super(MESSAGE_CODES.USER_NOT_EXISTS);
  }
}

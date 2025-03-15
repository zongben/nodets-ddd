import { FailReturn } from "../../../fail-return";
import { MESSAGE_CODES } from "../../../message-codes";

export class UserExsistError extends FailReturn {
  constructor() {
    super(MESSAGE_CODES.USER_ALREADY_EXISTS);
  }
}

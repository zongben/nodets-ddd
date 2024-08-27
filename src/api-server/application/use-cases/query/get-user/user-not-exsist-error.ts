import { FailReturn } from "../../../fail-return";
import { CODES } from "../../../codes";

export class UserNotExsistError extends FailReturn {
  constructor() {
    super(CODES.USER_NOT_EXISTS);
  }
}

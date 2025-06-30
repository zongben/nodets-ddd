import { FailReturn } from "../../../fail-return";
import { CODES } from "../../../codes";

export class UserExistError extends FailReturn {
  constructor() {
    super(CODES.USER_ALREADY_EXISTS);
  }
}

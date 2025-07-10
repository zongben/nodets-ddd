import { ErrorCodes } from "../../../error-codes";
import { FailReturn } from "../../../fail-return";

export type RegisterResult = {
  account: string;
  username: string;
};

export class UserExistError extends FailReturn {
  constructor() {
    super(ErrorCodes.USER_ALREADY_EXISTS);
  }
}

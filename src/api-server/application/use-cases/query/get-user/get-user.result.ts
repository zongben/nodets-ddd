import { ErrorCodes } from "../../../error-codes";
import { FailReturn } from "../../../fail-return";

export class UserNotExistError extends FailReturn {
  constructor() {
    super(ErrorCodes.USER_NOT_EXISTS);
  }
}

export type GetUserResult = {
  id: string;
  account: string;
  username: string;
};

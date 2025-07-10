import { ErrorCodes } from "../../../error-codes";

export type GetUserResult = {
  id: string;
  account: string;
  username: string;
};

export type GetUserError = ErrorCodes.USER_NOT_EXISTS;

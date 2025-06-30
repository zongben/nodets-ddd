import { IBaseReturn } from "../application/interfaces/base-return.interface";
import { BaseResponse } from "./base-response";
import { ErrorResponse } from "./error-response";
import { Responses } from "./responses";

export const CommonResponse = (
  ret: IBaseReturn,
  errorHandler?: (ret: IBaseReturn) => BaseResponse | undefined,
) => {
  if (ret.isSuccess) {
    return Responses.OK(ret.data);
  } else if (errorHandler) {
    const errorRet = errorHandler(ret);
    if (errorRet) {
      return errorRet;
    }
  }
  return Responses.BadRequest(new ErrorResponse(ret.messageCode, ""));
};

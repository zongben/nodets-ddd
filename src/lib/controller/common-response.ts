import { BaseResult } from "../application/result.type";
import { BaseResponse } from "./base-response";

export const CommonResponse = <T>(
  result: BaseResult<T>,
  successHandler: (data: T) => BaseResponse,
  errorHandler?: (errorCode: string) => BaseResponse | undefined,
) => {
  if (result.isSuccess) {
    return successHandler(result.data);
  } else if (errorHandler) {
    return errorHandler(result.errorCode);
  }
};

import { BaseResult } from "../application/result.type";
import { BaseResponse } from "./base-response";
import { DownloadResponse } from "./download-response";

export const resultHandler = <T>(
  result: BaseResult<T>,
  onSuccess: (data: T) => BaseResponse | DownloadResponse,
  onError?: (errorCode: string) => BaseResponse | undefined,
) => {
  if (result.isSuccess) {
    return onSuccess(result.data);
  } else if (onError) {
    return onError(result.errorCode);
  }
};

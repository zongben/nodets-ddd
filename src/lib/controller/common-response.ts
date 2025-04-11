import { IBaseReturn } from "../application/interfaces/base-return.interface";
import { BaseResponse } from "./base-response";

export const commonResponse = (ret: IBaseReturn) => {
  const { isSuccess, code: messageCode, data } = ret;
  if (isSuccess) {
    return new BaseResponse(200, data);
  } else {
    return new BaseResponse(400, {
      msg: messageCode,
    });
  }
};

export const baseResponse = (statusCode: number, data: any) => {
  return new BaseResponse(statusCode, data);
};

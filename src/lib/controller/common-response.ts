import { IBaseReturn } from "../application/interfaces/base-return.interface";
import { ErrorResponse } from "./error-response";
import { Responses } from "./responses";

export const CommonResponse = (ret: IBaseReturn) => {
  if (ret.isSuccess) {
    return Responses.OK(ret.data);
  } else {
    return Responses.BadRequest(new ErrorResponse(ret.code, ""));
  }
};

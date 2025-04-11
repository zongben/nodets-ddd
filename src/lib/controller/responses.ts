import { BaseResponse } from "./base-response";
import { ErrorResponse } from "./error-response";

export class Responses {
  static OK(data: any) {
    return new BaseResponse(200, data);
  }

  static Created(data: any) {
    return new BaseResponse(201, data);
  }

  static NoContent() {
    return new BaseResponse(204, null);
  }

  static BadRequest(error: ErrorResponse) {
    return new BaseResponse(400, error);
  }

  static Unauthorized(error: ErrorResponse) {
    return new BaseResponse(401, error);
  }

  static Forbidden(error: ErrorResponse) {
    return new BaseResponse(403, error);
  }

  static NotFound(error: ErrorResponse) {
    return new BaseResponse(404, error);
  }

  static Conflict(error: ErrorResponse) {
    return new BaseResponse(409, error);
  }
}

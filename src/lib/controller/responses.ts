import { BaseResponse } from "./base-response";

export class Responses {
  static OK(data: any) {
    return new BaseResponse(200, data);
  }

  static Created(data: any) {
    return new BaseResponse(201, data);
  }

  static Accepted(data: any) {
    return new BaseResponse(202, data);
  }

  static NoContent() {
    return new BaseResponse(204, null);
  }

  static BadRequest(error: any) {
    return new BaseResponse(400, error);
  }

  static Unauthorized(error: any) {
    return new BaseResponse(401, error);
  }

  static Forbidden(error: any) {
    return new BaseResponse(403, error);
  }

  static NotFound(error: any) {
    return new BaseResponse(404, error);
  }

  static Conflict(error: any) {
    return new BaseResponse(409, error);
  }
}

import { BaseResponse } from "./base-response";

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

  static BadRequest(message: string) {
    return new BaseResponse(400, message);
  }

  static Unauthorized(message: string) {
    return new BaseResponse(401, message);
  }

  static Forbidden(message: string) {
    return new BaseResponse(403, message);
  }

  static NotFound(message: string) {
    return new BaseResponse(404, message);
  }

  static Conflict(message: string) {
    return new BaseResponse(409, message);
  }
}

import { IBaseResponse } from "./interfaces/base-response.interface";

export class BaseResponse implements IBaseResponse {
  status: number;
  body: any;

  constructor(status: number, body: any) {
    this.status = status;
    this.body = body;
  }
}

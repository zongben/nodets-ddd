import { IBaseReturn } from "../../lib/application/interfaces/base-return.interface";
import { MESSAGE_CODES } from "./message-codes";

export class SuccessReturn implements IBaseReturn {
  isSuccess = true;
  messageCode = MESSAGE_CODES.SUCCESS;
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

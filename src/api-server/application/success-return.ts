import { BaseReturn } from "../../lib/application/base-return";
import { MESSAGE_CODES } from "./message-codes";

export class SuccessReturn extends BaseReturn {
  isSuccess = true;
  messageCode = MESSAGE_CODES.SUCCESS;
  data: any;

  constructor(data: any) {
    super();
    this.data = data;
  }
}

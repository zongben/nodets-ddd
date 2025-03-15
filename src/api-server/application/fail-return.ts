import { IBaseReturn } from "../../lib/application/base-return.interface";

export class FailReturn implements IBaseReturn {
  isSuccess: boolean = false;
  messageCode: string;
  data: any;

  constructor(messageCode: string, data: any = null) {
    this.messageCode = messageCode;
    this.data = data;
  }
}

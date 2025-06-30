import { IBaseReturn } from "../../lib/application/interfaces/base-return.interface";

export class FailReturn implements IBaseReturn {
  isSuccess: boolean = false;
  messageCode: string;
  data: any;

  constructor(code: string, data: any = null) {
    this.messageCode = code;
    this.data = data;
  }
}

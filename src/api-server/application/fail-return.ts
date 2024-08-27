import { IBaseReturn } from "../../lib/application/interfaces/base-return.interface";

export class FailReturn implements IBaseReturn {
  isSuccess: boolean = false;
  code: string;
  data: any;

  constructor(code: string, data: any = null) {
    this.code = code;
    this.data = data;
  }
}

import { IBaseReturn } from "../../lib/application/interfaces/base-return.interface";
import { CODES } from "./codes";

export class SuccessReturn implements IBaseReturn {
  isSuccess = true;
  code = CODES.SUCCESS;
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}

import { SuccessResult } from "../../lib/application/result.type";

export class SuccessReturn<T> implements SuccessResult<T> {
  isSuccess: true;
  data: T;

  constructor(data: T) {
    this.isSuccess = true;
    this.data = data;
  }
}

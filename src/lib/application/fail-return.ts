import { ErrorResult } from "../../lib/application/result.type";

export class FailReturn<E> implements ErrorResult<E> {
  isSuccess: false;
  error: E;

  constructor(err: E) {
    this.isSuccess = false;
    this.error = err;
  }
}

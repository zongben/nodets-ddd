import { FailResult } from "../../lib/application/result.type";

export class FailReturn implements FailResult {
  isSuccess: false;
  errorCode: string;

  constructor(errorCode: string) {
    this.isSuccess = false;
    this.errorCode = errorCode;
  }
}

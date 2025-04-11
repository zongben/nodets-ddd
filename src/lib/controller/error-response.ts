export class ErrorResponse {
  code: string;
  message: string;

  constructor(code: any, message: string) {
    this.code = code;
    this.message = message;
  }
}

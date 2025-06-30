export class ErrorResponse {
  messageCode: string;
  message: string;

  constructor(messageCode: any, message: string) {
    this.messageCode = messageCode;
    this.message = message;
  }
}

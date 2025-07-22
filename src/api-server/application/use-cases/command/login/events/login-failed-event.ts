export class LoginFailedEvent {
  readonly account: string;

  constructor(account: string) {
    this.account = account;
  }
}

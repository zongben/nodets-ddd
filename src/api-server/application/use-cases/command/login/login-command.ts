export class LoginCommand {
  readonly account: string;
  readonly password: string;

  constructor(props: { account: string; password: string }) {
    this.account = props.account;
    this.password = props.password;
  }
}

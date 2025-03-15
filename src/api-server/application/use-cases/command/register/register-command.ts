export class RegisterCommand {
  readonly account: string;
  readonly password: string;
  readonly username: string;

  constructor(props: { account: string; password: string; username: string }) {
    this.account = props.account;
    this.password = props.password;
    this.username = props.username;
  }
}

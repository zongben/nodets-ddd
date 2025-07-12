import { Request } from "../../../../../lib/mediator/request.abstract";
import { Result } from "../../../../../lib/result/result.type";
import { RegisterError, RegisterResult } from "./register.result";

export class RegisterCommand extends Request<
  Result<RegisterResult, RegisterError>
> {
  readonly account: string;
  readonly password: string;
  readonly username: string;

  constructor(props: { account: string; password: string; username: string }) {
    super();
    this.account = props.account;
    this.password = props.password;
    this.username = props.username;
  }
}

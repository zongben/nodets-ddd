import { Request } from "../../../../../lib/mediator/request.abstract";
import { Result } from "../../../../../lib/result/result.type";
import { LoginError, LoginResult } from "./loing.result";

export class LoginCommand extends Request<Result<LoginResult, LoginError>> {
  readonly account: string;
  readonly password: string;

  constructor(props: { account: string; password: string }) {
    super();
    this.account = props.account;
    this.password = props.password;
  }
}

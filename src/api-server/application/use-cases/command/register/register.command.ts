import { BaseResult } from "../../../../../lib/application/result.type";
import { Request } from "../../../../../lib/mediator/request.abstract";
import { RegisterResult } from "./register.result";

export class RegisterCommand extends Request<BaseResult<RegisterResult>> {
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

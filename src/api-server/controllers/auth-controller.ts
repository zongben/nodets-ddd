import { BaseController } from "../../lib/controller/base-controller";
import { RegisterCommand } from "../application/use-cases/command/register/register-command";
import { LoginCommand } from "../application/use-cases/command/login/login-command";
import { RegisterRule } from "../contract/auth/register/register-rule";
import { LoginRule } from "../contract/auth/login/login-rule";
import { RegisterReq } from "../contract/auth/register/register-req.type";
import { LoginReq } from "../contract/auth/login/login-req.type";
import { CommonResponse } from "../../lib/controller/common-response";

export class AuthController extends BaseController {
  apiPath: string = "/auth";

  async register(req: any) {
    const { account, password, username } = req.body as RegisterReq;
    const command = new RegisterCommand({
      account,
      password,
      username,
    });
    const ret = await this._sender.send(command);
    return CommonResponse(ret);
  }

  async login(req: any) {
    const { account, password } = req.body as LoginReq;
    const command = new LoginCommand({
      account,
      password,
    });
    const ret = await this._sender.send(command);
    return CommonResponse(ret);
  }

  mapRoutes() {
    this.router.post(
      "/register",
      this.validate(new RegisterRule()),
      this.action(this.register),
    );
    this.router.post(
      "/login",
      this.validate(new LoginRule()),
      this.action(this.login),
    );
    return this.router;
  }
}

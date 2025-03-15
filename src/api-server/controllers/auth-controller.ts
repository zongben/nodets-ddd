import { NextFunction } from "express";
import { BaseController } from "../../lib/controller/base-controller";
import { RegisterReq } from "../contract/auth/register/register-req";
import { RegisterCommand } from "../application/use-cases/command/register/register-command";
import { LoginReq } from "../contract/auth/login/login-req";
import { LoginCommand } from "../application/use-cases/command/login/login-command";
import { registerRule } from "../contract/auth/register/register-rule";
import { loginRule } from "../contract/auth/login/login-rule";

export class AuthController extends BaseController {
  apiPath: string = "/auth";

  async register(req: any, res: any, next: NextFunction) {
    const { account, password, username } = req.body as RegisterReq;
    const command = new RegisterCommand({
      account,
      password,
      username
    });
    const ret = await this._sender.send(command);
    this.sendReturn(res, ret);
    next();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async error(_req: any, _res: any, _next: NextFunction) {
    throw "test-error";
  }

  async login(req: any, res: any, next: NextFunction) {
    const { account, password } = req.body as LoginReq;
    const command = new LoginCommand({
      account,
      password,
    });
    const ret = await this._sender.send(command);
    this.sendReturn(res, ret);
    next();
  }

  mapRoutes() {
    this.router.post(
      "/register",
      this.validate(registerRule),
      this.action(this.register),
    );
    this.router.post(
      "/login",
      this.validate(loginRule),
      this.action(this.login),
    );
    this.router.get("/error", this.action(this.error));
    return this.router;
  }
}

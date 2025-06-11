import { BaseController } from "../../lib/controller/base-controller";
import { RegisterCommand } from "../application/use-cases/command/register/register-command";
import { LoginCommand } from "../application/use-cases/command/login/login-command";
import { RegisterReq, RegisterRule } from "../contract/auth/register/register-rule";
import { LoginReq, LoginRule } from "../contract/auth/login/login-rule";
import { CommonResponse } from "../../lib/controller/common-response";
import { SuccessReturn } from "../application/success-return";

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

  async login(req: any, res: any) {
    const { account, password } = req.body as LoginReq;
    const command = new LoginCommand({
      account,
      password,
    });
    const ret = await this._sender.send(command);
    if (!ret.isSuccess) {
      return CommonResponse(ret);
    }

    res.cookie("refresh_token", ret.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return CommonResponse(
      new SuccessReturn({
        token: ret.data.accessToken,
      }),
    );
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

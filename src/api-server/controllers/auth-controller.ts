import { BaseController } from "../../lib/controller/base-controller";
import { RegisterCommand } from "../application/use-cases/command/register/register-command";
import { LoginCommand } from "../application/use-cases/command/login/login-command";
import {
  RegisterReq,
  RegisterRule,
} from "../contract/auth/register/register-rule";
import { LoginReq, LoginRule } from "../contract/auth/login/login-rule";
import { CommonResponse } from "../../lib/controller/common-response";
import { Responses } from "../../lib/controller/responses";
import { ErrorResponse } from "../../lib/controller/error-response";
import { MESSAGE_CODES } from "../application/message-codes";

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
    return CommonResponse(ret, (ret) => {
      if (ret.messageCode === MESSAGE_CODES.USER_ALREADY_EXISTS) {
        return Responses.Conflict(new ErrorResponse(ret.messageCode, ""));
      }
    });
  }

  async login(req: any, res: any) {
    const { account, password } = req.body as LoginReq;
    const command = new LoginCommand({
      account,
      password,
    });
    const ret = await this._sender.send(command);
    if (ret.isSuccess) {
      res.cookie("refresh_token", ret.data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      ret.data = {
        accessToken: ret.data.accessToken,
      };
    }
    return CommonResponse(ret, (ret) => {
      if (ret.messageCode === MESSAGE_CODES.ACCOUNT_OR_PASSWORD_INCORRECT) {
        return Responses.Unauthorized(new ErrorResponse(ret.messageCode, ""));
      }
    });
  }

  async error() {
    throw new Error("This is an error test");
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
    this.router.get("/error", this.action(this.error));
    return this.router;
  }
}

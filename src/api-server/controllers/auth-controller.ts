import { BaseController } from "../../lib/controller/base-controller";
import {
  RegisterReq,
  RegisterRule,
} from "../contract/auth/register/register-rule";
import { LoginReq, LoginRule } from "../contract/auth/login/login-rule";
import { CommonResponse } from "../../lib/controller/common-response";
import { Responses } from "../../lib/controller/responses";
import { ErrorResponse } from "../../lib/controller/error-response";
import { ErrorCodes } from "../application/error-codes";
import { BaseResult } from "../../lib/application/result.type";
import { RegisterCommand } from "../application/use-cases/command/register/register.command";
import { RegisterResult } from "../application/use-cases/command/register/register.result";
import { LoginCommand } from "../application/use-cases/command/login/login.command";
import { LoginResult } from "../application/use-cases/command/login/loing.result";
import { TrackClassMethods } from "../../lib/utils/tracker";

@TrackClassMethods()
export class AuthController extends BaseController {
  apiPath: string = "/auth";

  async register(req: any) {
    const { account, password, username } = req.body as RegisterReq;
    const command = new RegisterCommand({
      account,
      password,
      username,
    });
    const result = await this._sender.send<BaseResult<RegisterResult>>(command);
    return CommonResponse(
      result,
      (data) => {
        return Responses.OK(data);
      },
      (e) => {
        if (e === ErrorCodes.USER_ALREADY_EXISTS) {
          return Responses.Conflict(new ErrorResponse(e, ""));
        }
      },
    );
  }

  async login(req: any, res: any) {
    const { account, password } = req.body as LoginReq;
    const command = new LoginCommand({
      account,
      password,
    });
    const result = await this._sender.send<BaseResult<LoginResult>>(command);
    return CommonResponse(
      result,
      (data) => {
        res.cookie("refresh_token", data.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        return Responses.OK({
          accessToken: data.accessToken,
        });
      },
      (e) => {
        if (e === ErrorCodes.ACCOUNT_OR_PASSWORD_INCORRECT) {
          return Responses.Unauthorized(new ErrorResponse(e, ""));
        }
      },
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

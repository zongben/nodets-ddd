import { BaseController } from "../../lib/controller/base-controller";
import {
  RegisterReq,
  RegisterRule,
} from "../contract/auth/register/register-rule";
import { LoginReq, LoginRule } from "../contract/auth/login/login-rule";
import { Responses } from "../../lib/controller/responses";
import { ErrorResponse } from "../../lib/controller/error-response";
import { ErrorCodes } from "../application/error-codes";
import { RegisterCommand } from "../application/use-cases/command/register/register.command";
import { LoginCommand } from "../application/use-cases/command/login/login.command";
import { TrackClassMethods } from "../../lib/utils/tracker";
import { matchResult } from "../../lib/controller/result.handler";

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
    const result = await this.dispatch(command);
    return matchResult(result, {
      ok: (v) => {
        return Responses.Created(v);
      },
      err: {
        [ErrorCodes.USER_ALREADY_EXISTS]: (e) => {
          return Responses.Conflict(new ErrorResponse(e, ""));
        },
      },
    });
  }

  async login(req: any, res: any) {
    const { account, password } = req.body as LoginReq;
    const command = new LoginCommand({
      account,
      password,
    });
    const result = await this.dispatch(command);
    return matchResult(result, {
      ok: (v) => {
        res.cookie("refresh_token", v.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        return Responses.OK({
          accessToken: v.accessToken,
        });
      },
      err: {
        [ErrorCodes.ACCOUNT_OR_PASSWORD_INCORRECT]: (e) => {
          return Responses.Unauthorized(new ErrorResponse(e, ""));
        },
      },
    });
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

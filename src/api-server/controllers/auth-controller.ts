import { BaseController } from "../../lib/controller/base-controller";
import {
  RegisterReq,
  RegisterRule,
} from "../contract/auth/register/register-rule";
import { LoginReq, LoginRule } from "../contract/auth/login/login-rule";
import { ErrorCodes } from "../application/error-codes";
import { RegisterCommand } from "../application/use-cases/command/register/register.command";
import { LoginCommand } from "../application/use-cases/command/login/login.command";
import { TrackClassMethods } from "../../lib/utils/tracker";
import { Responses } from "../../lib/controller/responses";
import { ErrorBody } from "../../lib/controller/error-body";
import { validate } from "../../lib/controller/validater";
import { Controller } from "../../lib/controller/decorator/controller.decorator";
import { Post } from "../../lib/controller/decorator/route.decorator";
import { Body } from "../../lib/controller/decorator/param.decorator";
import { matchResult } from "../../lib/result/result.handler";

@TrackClassMethods()
@Controller("/auth")
export class AuthController extends BaseController {
  @Post("/register", validate(RegisterRule))
  async register(@Body() req: RegisterReq) {
    const command = new RegisterCommand(req);
    const result = await this.dispatch(command);
    return matchResult(result, {
      ok: (v) => {
        return Responses.Created(v);
      },
      err: {
        [ErrorCodes.USER_ALREADY_EXISTS]: (e) => {
          return Responses.Conflict<ErrorBody>({
            errorCode: e,
          });
        },
      },
    });
  }

  @Post("/login", validate(LoginRule))
  async login(@Body() req: LoginReq) {
    const command = new LoginCommand(req);
    const result = await this.dispatch(command);
    return matchResult(result, {
      ok: (v) => {
        return Responses.OK({
          accessToken: v.accessToken,
        }).with({
          cookies: [
            {
              key: "refresh_token",
              value: v.refreshToken,
              options: {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30, // 30days
              },
            },
          ],
        });
      },
      err: {
        [ErrorCodes.ACCOUNT_OR_PASSWORD_INCORRECT]: (e) => {
          return Responses.Unauthorized<ErrorBody>({
            errorCode: e,
          });
        },
      },
    });
  }
}

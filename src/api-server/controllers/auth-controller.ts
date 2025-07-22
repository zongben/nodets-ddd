import {
  RegisterReq,
  RegisterRule,
} from "../contract/auth/register/register-rule";
import { RegisterCommand } from "../application/use-cases/command/register/register.command";
import { ErrorBody } from "../../lib/controller/error-body";
import { LoginReq, LoginRule } from "../contract/auth/login/login-rule";
import { LoginCommand } from "../application/use-cases/command/login/login.command";
import { ErrorCodes } from "../application/error-codes";
import { Controller, FromBody, matchResult, MediatedController, Post, Responses, TrackClassMethods, validate } from "empack";

@TrackClassMethods()
@Controller("/auth")
export class AuthController extends MediatedController {
  @Post("/register", validate(RegisterRule))
  async register(@FromBody() req: RegisterReq) {
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
  async login(@FromBody() req: LoginReq) {
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

import {
  RegisterReq,
  RegisterRule,
} from "../contract/auth/register/register-rule";
import { RegisterCommand } from "../application/use-cases/command/register/register.command";
import { ErrorBody } from "../../lib/controller/error-body";
import { LoginReq, LoginRule } from "../contract/auth/login/login-rule";
import { LoginCommand } from "../application/use-cases/command/login/login.command";
import { ErrorCodes } from "../application/error-codes";
import { matchResult, Track, validate } from "@empackjs/utils";
import {
  Controller,
  FromBody,
  Guard,
  MediatedController,
  Post,
  Responses,
} from "@empackjs/core";

@Track()
@Controller("/auth")
@Guard("none")
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
          return Responses.ClientError.Conflict<ErrorBody>({
            errorCode: e,
          });
        },
      },
    });
  }

  @Post("/login", validate(LoginRule))
  async login(@FromBody() body: LoginReq) {
    const command = new LoginCommand(body);
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
          return Responses.ClientError.Unauthorized<ErrorBody>({
            errorCode: e,
          });
        },
      },
    });
  }
}

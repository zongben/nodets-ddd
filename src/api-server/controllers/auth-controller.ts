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
import { matchResult } from "../../lib/controller/result.handler";
import { Responses } from "../../lib/controller/responses";
import { ErrorBody } from "../../lib/controller/error-body";
import { validate } from "../../lib/controller/validater";
import {
  Body,
  Controller,
  Post,
} from "../../lib/controller/decorator/controller.decorator";

@TrackClassMethods()
@Controller("/auth")
export class AuthController extends BaseController {
  @Post("/register", ...validate(new RegisterRule()))
  async register(@Body() req: RegisterReq) {
    const { account, password, username } = req;
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
          return Responses.Conflict<ErrorBody>({
            errorCode: e,
          });
        },
      },
    });
  }

  @Post("/login", ...validate(new LoginRule()))
  async login(@Body() req: LoginReq) {
    const { account, password } = req;
    const command = new LoginCommand({
      account,
      password,
    });
    const result = await this.dispatch(command);
    return matchResult(result, {
      ok: (v) => {
        // res.cookie("refresh_token", v.refreshToken, {
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: "Strict",
        //   maxAge: 60 * 60 * 24 * 30, // 30 days
        // });
        return Responses.OK({
          accessToken: v.accessToken,
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

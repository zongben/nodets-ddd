import { GetUserQuery } from "../application/use-cases/query/get-user/get-user.query";
import { ErrorBody } from "../../lib/controller/error-body";
import { ErrorCodes } from "../application/error-codes";
import { Locals } from "../contract/locals";
import { Controller, FromLocals, Get, matchResult, MediatedController, Responses, TrackClassMethods } from "empack";

@TrackClassMethods()
@Controller("/user")
export class UserController extends MediatedController {
  @Get("/")
  async getUser(@FromLocals() locals: Locals) {
    const { userid } = locals.jwt;
    const query = new GetUserQuery(userid);
    const result = await this.dispatch(query);
    return matchResult(result, {
      ok: (v) => {
        return Responses.OK(v);
      },
      err: {
        [ErrorCodes.USER_NOT_EXISTS]: (e) => {
          return Responses.NotFound<ErrorBody>({
            errorCode: e,
          });
        },
      },
    });
  }
}

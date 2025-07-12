import { BaseController } from "../../lib/controller/base-controller";
import { Controller } from "../../lib/controller/decorator/controller.decorator";
import { Locals } from "../../lib/controller/decorator/param.decorator";
import { Get } from "../../lib/controller/decorator/route.decorator";
import { ErrorBody } from "../../lib/controller/error-body";
import { Responses } from "../../lib/controller/responses";
import { matchResult } from "../../lib/controller/result.handler";
import { TrackClassMethods } from "../../lib/utils/tracker";
import { ErrorCodes } from "../application/error-codes";
import { GetUserQuery } from "../application/use-cases/query/get-user/get-user.query";
import { locals } from "../contract/locals";

@TrackClassMethods()
@Controller("/user")
export class UserController extends BaseController {
  @Get("/")
  async getUser(@Locals() locals: locals) {
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

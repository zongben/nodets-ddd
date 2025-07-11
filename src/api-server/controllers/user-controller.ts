import { BaseController } from "../../lib/controller/base-controller";
import { ErrorBody } from "../../lib/controller/error-body";
import { Responses } from "../../lib/controller/responses";
import { matchResult } from "../../lib/controller/result.handler";
import { TrackClassMethods } from "../../lib/utils/tracker";
import { ErrorCodes } from "../application/error-codes";
import { GetUserQuery } from "../application/use-cases/query/get-user/get-user.query";

@TrackClassMethods()
export class UserController extends BaseController {
  apiPath: string = "/user";

  async getUser(_req: any, res: any) {
    const { userid } = res.locals.jwt;
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

  mapRoutes() {
    this.router.get("/", this.action(this.getUser));
    return this.router;
  }
}

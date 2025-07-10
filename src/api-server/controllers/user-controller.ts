import { BaseResult } from "../../lib/application/result.type";
import { BaseController } from "../../lib/controller/base-controller";
import { CommonResponse } from "../../lib/controller/common-response";
import { ErrorResponse } from "../../lib/controller/error-response";
import { Responses } from "../../lib/controller/responses";
import { TrackClassMethods } from "../../lib/utils/track";
import { ErrorCodes } from "../application/error-codes";
import { GetUserQuery } from "../application/use-cases/query/get-user/get-user.query";
import { GetUserResult } from "../application/use-cases/query/get-user/get-user.result";

@TrackClassMethods()
export class UserController extends BaseController {
  apiPath: string = "/user";

  async getUser(_req: any, res: any) {
    const { userid } = res.locals.jwt;
    const query = new GetUserQuery(userid);
    const result = await this._sender.send<BaseResult<GetUserResult>>(query);
    return CommonResponse(
      result,
      (data) => {
        return Responses.OK(data);
      },
      (e) => {
        if (e === ErrorCodes.USER_NOT_EXISTS) {
          return Responses.NotFound(new ErrorResponse(e, ""));
        }
      },
    );
  }

  mapRoutes() {
    this.router.get("/", this.action(this.getUser));
    return this.router;
  }
}

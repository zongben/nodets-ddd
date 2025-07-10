import { BaseController } from "../../lib/controller/base-controller";
import { ErrorResponse } from "../../lib/controller/error-response";
import { Responses } from "../../lib/controller/responses";
import { resultHandler } from "../../lib/controller/result.handler";
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
    return resultHandler(
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

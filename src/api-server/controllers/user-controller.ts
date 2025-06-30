import { BaseController } from "../../lib/controller/base-controller";
import { CommonResponse } from "../../lib/controller/common-response";
import { ErrorResponse } from "../../lib/controller/error-response";
import { Responses } from "../../lib/controller/responses";
import { GetUserQuery } from "../application/use-cases/query/get-user/get-user-query";
import { UserNotExistError } from "../application/use-cases/query/get-user/user-not-exist-error";

export class UserController extends BaseController {
  apiPath: string = "/user";

  async getUser(_req: any, res: any) {
    const { userid } = res.locals.jwt;
    const query = new GetUserQuery(userid);
    const ret = await this._sender.send(query);
    return CommonResponse(ret, (ret) => {
      if (ret instanceof UserNotExistError) {
        return Responses.NotFound(new ErrorResponse(ret.messageCode, ""));
      }
    });
  }

  mapRoutes() {
    this.router.get("/", this.action(this.getUser));
    return this.router;
  }
}

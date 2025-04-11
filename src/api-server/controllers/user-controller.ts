import { IBaseReturn } from "../../lib/application/interfaces/base-return.interface";
import { BaseController } from "../../lib/controller/base-controller";
import { ErrorResponse } from "../../lib/controller/error-response";
import { Responses } from "../../lib/controller/responses";
import { CODES } from "../application/codes";
import { GetUserQuery } from "../application/use-cases/query/get-user/get-user-query";

export class UserController extends BaseController {
  apiPath: string = "/user";

  async getUser(_req: any, res: any) {
    const { account } = res.locals.jwt;
    const query = new GetUserQuery(account);
    const ret = await this._sender.send<IBaseReturn>(query);
    if (ret.isSuccess) {
      return Responses.OK(ret.data);
    }
    else if(ret.code == CODES.USER_NOT_EXISTS) {
      return Responses.NotFound(new ErrorResponse(CODES.USER_NOT_EXISTS, "User not exists"));
    }
  }

  mapRoutes() {
    this.router.get("/", this.action(this.getUser));
    return this.router;
  }
}

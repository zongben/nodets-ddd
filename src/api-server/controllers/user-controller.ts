import { BaseController } from "../../lib/controller/base-controller";
import { commonResponse } from "../../lib/controller/common-response";
import { GetUserQuery } from "../application/use-cases/query/get-user/get-user-query";

export class UserController extends BaseController {
  apiPath: string = "/user";

  async getUser(_req: any, res: any) {
    const { account } = res.locals.jwt;
    const query = new GetUserQuery(account);
    const ret = await this._sender.send(query);
    return commonResponse(ret);
  }

  mapRoutes() {
    this.router.get("/", this.action(this.getUser));
    return this.router;
  }
}

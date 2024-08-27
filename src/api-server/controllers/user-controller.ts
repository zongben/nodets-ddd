import { BaseController } from "../../lib/controller/base-controller";
import { CommonResponse } from "../../lib/controller/common-response";
import { GetUserQuery } from "../application/use-cases/query/get-user/get-user-query";

export class UserController extends BaseController {
  apiPath: string = "/user";

  async getUser(_req: any, res: any) {
    const { id } = res.locals.jwt;
    const query = new GetUserQuery(id);
    const ret = await this._sender.send(query);
    return CommonResponse(ret);
  }

  mapRoutes() {
    this.router.get("/", this.action(this.getUser));
    return this.router;
  }
}

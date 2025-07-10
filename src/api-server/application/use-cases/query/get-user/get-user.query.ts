import { BaseResult } from "../../../../../lib/application/result.type";
import { Request } from "../../../../../lib/mediator/request.abstract";
import { GetUserResult } from "./get-user.result";

export class GetUserQuery extends Request<BaseResult<GetUserResult>> {
  constructor(public id: string) {
    super();
  }
}

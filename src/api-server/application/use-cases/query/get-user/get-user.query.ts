import { BaseResult } from "../../../../../lib/application/result.type";
import { Request } from "../../../../../lib/mediator/request.abstract";
import { GetUserError, GetUserResult } from "./get-user.result";

export class GetUserQuery extends Request<
  BaseResult<GetUserResult, GetUserError>
> {
  constructor(public id: string) {
    super();
  }
}

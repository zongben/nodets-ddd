import { Request } from "../../../../../lib/mediator/request.abstract";
import { Result } from "../../../../../lib/result/result.type";
import { GetUserError, GetUserResult } from "./get-user.result";

export class GetUserQuery extends Request<
  Result<GetUserResult, GetUserError>
> {
  constructor(public id: string) {
    super();
  }
}

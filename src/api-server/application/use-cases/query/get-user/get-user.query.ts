import { MediatedRequest } from "@empackjs/core";
import { GetUserError, GetUserResult } from "./get-user.result";
import { OneOf } from "@empackjs/utils";

export class GetUserQuery extends MediatedRequest<
  OneOf<GetUserResult, GetUserError>
> {
  constructor(public id: string) {
    super();
  }
}

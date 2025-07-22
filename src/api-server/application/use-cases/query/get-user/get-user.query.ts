import { MediatedRequest, OneOf } from "empack";
import { GetUserError, GetUserResult } from "./get-user.result";

export class GetUserQuery extends MediatedRequest<
  OneOf<GetUserResult, GetUserError>
> {
  constructor(public id: string) {
    super();
  }
}

import { inject } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { HandleFor } from "../../../../../lib/mediator/mediator.decorator";
import { GetUserQuery } from "./get-user.query";
import { Result } from "../../../../../lib/application/result.type";
import { GetUserError, GetUserResult } from "./get-user.result";
import { TrackClassMethods } from "../../../../../lib/utils/tracker";
import { FailReturn } from "../../../../../lib/application/fail-return";
import { ErrorCodes } from "../../../error-codes";
import { OkReturn } from "../../../../../lib/application/ok-return";

@HandleFor(GetUserQuery)
@TrackClassMethods()
export class GetUserHandler
  implements IReqHandler<GetUserQuery, Result<GetUserResult, GetUserError>>
{
  constructor(
    @inject(UserRepository) private _userRepository: IUserRepository,
  ) {}
  async handle(
    query: GetUserQuery,
  ): Promise<Result<GetUserResult, GetUserError>> {
    const user = await this._userRepository.getById(query.id);
    if (!user) {
      return new FailReturn(ErrorCodes.USER_NOT_EXISTS);
    }

    return new OkReturn({
      id: user.id,
      account: user.account,
      username: user.username,
    });
  }
}

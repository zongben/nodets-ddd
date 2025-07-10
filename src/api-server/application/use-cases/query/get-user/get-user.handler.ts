import { inject } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { SuccessReturn } from "../../../success-return";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { HandleFor } from "../../../../../lib/mediator/mediator.decorator";
import { GetUserQuery } from "./get-user.query";
import { BaseResult } from "../../../../../lib/application/result.type";
import { GetUserResult, UserNotExistError } from "./get-user.result";
import { TrackClassMethods } from "../../../../../lib/utils/tracker";

@HandleFor(GetUserQuery)
@TrackClassMethods()
export class GetUserHandler
  implements IReqHandler<GetUserQuery, BaseResult<GetUserResult>>
{
  constructor(
    @inject(UserRepository) private _userRepository: IUserRepository,
  ) {}
  async handle(query: GetUserQuery): Promise<BaseResult<GetUserResult>> {
    const user = await this._userRepository.getById(query.id);
    if (!user) {
      return new UserNotExistError();
    }

    return new SuccessReturn({
      id: user.id,
      account: user.account,
      username: user.username,
    });
  }
}

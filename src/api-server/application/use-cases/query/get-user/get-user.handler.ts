import { GetUserError, GetUserResult } from "./get-user.result";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { ErrorCodes } from "../../../error-codes";
import { GetUserQuery } from "./get-user.query";
import { ErrorReturn, HandleFor, inject, IReqHandler, OkReturn, OneOf, TrackClassMethods } from "empack";

@HandleFor(GetUserQuery)
@TrackClassMethods()
export class GetUserHandler
  implements IReqHandler<GetUserQuery, OneOf<GetUserResult, GetUserError>>
{
  constructor(
    @inject(UserRepository) private _userRepository: IUserRepository,
  ) {}
  async handle(
    query: GetUserQuery,
  ): Promise<OneOf<GetUserResult, GetUserError>> {
    const user = await this._userRepository.getById(query.id);
    if (!user) {
      return new ErrorReturn(ErrorCodes.USER_NOT_EXISTS);
    }

    return new OkReturn({
      id: user.id,
      account: user.account,
      username: user.username,
    });
  }
}

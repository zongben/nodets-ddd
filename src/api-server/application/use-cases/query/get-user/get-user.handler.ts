import { GetUserError, GetUserResult } from "./get-user.result";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { ErrorCodes } from "../../../error-codes";
import { HandleFor, inject, IReqHandler } from "@empackjs/core";
import { ErrorReturn, OkReturn, OneOf, Track } from "@empackjs/utils";
import { GetUserQuery } from "./get-user.query";

@HandleFor(GetUserQuery)
@Track()
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

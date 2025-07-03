import { inject } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { GetUserQuery } from "./get-user-query";
import { UserNotExistError } from "./user-not-exist-error";
import { SuccessReturn } from "../../../success-return";
import { IBaseReturn } from "../../../../../lib/application/interfaces/base-return.interface";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { Handler } from "../../../../../lib/mediator/mediator.decorator";

@Handler(GetUserQuery)
export class GetUserHandler implements IReqHandler<GetUserQuery, IBaseReturn> {
  constructor(
    @inject(UserRepository) private _userRepository: IUserRepository,
  ) {}
  async handle(query: GetUserQuery): Promise<IBaseReturn> {
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

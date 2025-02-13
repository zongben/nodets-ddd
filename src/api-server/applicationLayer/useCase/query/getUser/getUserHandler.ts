import { inject, injectable } from "inversify";
import { IReqHandler } from "../../../../../lib/mediatorLib/interfaces/IReqHandler";
import { GetUserQuery } from "./getUserQuery";
import { UserRepository } from "../../../../infraLayer/repositories/userRepository";
import { IUserRepository } from "../../../persistence/IUserRepository";
import { UserNotExsistError } from "./userNotExsistError";
import { GetUserResult } from "./getUserResult";
import { SuccessReturn } from "../../../SuccessReturn";
import { BaseReturn } from "../../../../../lib/applicationLib/baseReturn";

@injectable()
export class GetUserHandler implements IReqHandler<GetUserQuery, BaseReturn> {
  constructor(
    @inject(UserRepository) private _userRepository: IUserRepository,
  ) {}
  async handle(query: GetUserQuery): Promise<BaseReturn> {
    const user = await this._userRepository.getByAccount(query.account);
    if (!user) {
      return new UserNotExsistError();
    }

    return new SuccessReturn(new GetUserResult(user.account, user.username));
  }
}

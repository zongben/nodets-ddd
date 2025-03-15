import { inject, injectable } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { GetUserQuery } from "./get-user-query";
import { BaseReturn } from "../../../../../lib/application/base-return";
import { UserRepository } from "../../../../infra/repositories/user-repository";
import { IUserRepository } from "../../../persistences/user-repository.interface";
import { UserNotExsistError } from "./user-not-exsist-error";
import { SuccessReturn } from "../../../success-return";
import { GetUserResult } from "./get-user-result";

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

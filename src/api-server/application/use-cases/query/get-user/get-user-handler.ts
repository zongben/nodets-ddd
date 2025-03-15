import { inject, injectable } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { GetUserQuery } from "./get-user-query";
import { UserRepository } from "../../../../infra/repositories/user-repository";
import { IUserRepository } from "../../../persistences/user-repository.interface";
import { UserNotExsistError } from "./user-not-exsist-error";
import { SuccessReturn } from "../../../success-return";
import { GetUserResult } from "./get-user-result";
import { IBaseReturn } from "../../../../../lib/application/base-return.interface";

@injectable()
export class GetUserHandler implements IReqHandler<GetUserQuery, IBaseReturn> {
  constructor(
    @inject(UserRepository) private _userRepository: IUserRepository,
  ) {}
  async handle(query: GetUserQuery): Promise<IBaseReturn> {
    const user = await this._userRepository.getByAccount(query.account);
    if (!user) {
      return new UserNotExsistError();
    }

    return new SuccessReturn(new GetUserResult(user.account, user.username));
  }
}

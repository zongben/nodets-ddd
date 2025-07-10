import { inject } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { SuccessReturn } from "../../../success-return";
import { Crypto } from "../../../../../lib/utils/crypto";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { UserRoot } from "../../../../domain/user/user.root";
import { guid } from "../../../../../lib/utils/guid";
import { HandleFor } from "../../../../../lib/mediator/mediator.decorator";
import { BaseResult } from "../../../../../lib/application/result.type";
import { RegisterResult, UserExistError } from "./register.result";
import { RegisterCommand } from "./register.command";
import { TrackClassMethods } from "../../../../../lib/utils/tracker";

@HandleFor(RegisterCommand)
@TrackClassMethods()
export class RegisterHandler
  implements IReqHandler<RegisterCommand, BaseResult<RegisterResult>>
{
  constructor(
    @inject(UserRepository) private readonly _userRepository: IUserRepository,
  ) {}

  async handle(req: RegisterCommand): Promise<BaseResult<RegisterResult>> {
    const isUserExist =
      (await this._userRepository.getByAccount(req.account)) !== null;
    if (isUserExist) {
      return new UserExistError();
    }
    const hashedPassword = await Crypto.hash(req.password);
    const userRoot = UserRoot.create({
      id: guid(),
      account: req.account,
      password: hashedPassword,
      username: req.username,
    });
    const user = await this._userRepository.create(userRoot);
    return new SuccessReturn({
      account: user.account,
      username: user.username,
    });
  }
}

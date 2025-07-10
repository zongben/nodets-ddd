import { inject } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { Crypto } from "../../../../../lib/utils/crypto";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { UserRoot } from "../../../../domain/user/user.root";
import { guid } from "../../../../../lib/utils/guid";
import { HandleFor } from "../../../../../lib/mediator/mediator.decorator";
import { BaseResult } from "../../../../../lib/application/result.type";
import { RegisterError, RegisterResult } from "./register.result";
import { RegisterCommand } from "./register.command";
import { TrackClassMethods } from "../../../../../lib/utils/tracker";
import { SuccessReturn } from "../../../../../lib/application/success-return";
import { FailReturn } from "../../../../../lib/application/fail-return";
import { ErrorCodes } from "../../../error-codes";

@HandleFor(RegisterCommand)
@TrackClassMethods()
export class RegisterHandler
  implements IReqHandler<RegisterCommand, BaseResult<RegisterResult, RegisterError>>
{
  constructor(
    @inject(UserRepository) private readonly _userRepository: IUserRepository,
  ) {}

  async handle(req: RegisterCommand): Promise<BaseResult<RegisterResult, RegisterError>> {
    const isUserExist =
      (await this._userRepository.getByAccount(req.account)) !== null;
    if (isUserExist) {
      return new FailReturn(ErrorCodes.USER_ALREADY_EXISTS);
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

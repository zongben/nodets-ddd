import { inject } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { Crypto } from "../../../../../lib/utils/crypto";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { UserRoot } from "../../../../domain/user/user.root";
import { guid } from "../../../../../lib/utils/guid";
import { RegisterError, RegisterResult } from "./register.result";
import { RegisterCommand } from "./register.command";
import { TrackClassMethods } from "../../../../../lib/utils/tracker";
import { ErrorCodes } from "../../../error-codes";
import { Result } from "../../../../../lib/result/result.type";
import { ErrorReturn } from "../../../../../lib/result/error-return";
import { OkReturn } from "../../../../../lib/result/ok-return";
import { HandleFor } from "../../../../../lib/mediator/decorator/mediator.decorator";

@HandleFor(RegisterCommand)
@TrackClassMethods()
export class RegisterHandler
  implements IReqHandler<RegisterCommand, Result<RegisterResult, RegisterError>>
{
  constructor(
    @inject(UserRepository) private readonly _userRepository: IUserRepository,
  ) {}

  async handle(req: RegisterCommand): Promise<Result<RegisterResult, RegisterError>> {
    const isUserExist =
      (await this._userRepository.getByAccount(req.account)) !== null;
    if (isUserExist) {
      return new ErrorReturn(ErrorCodes.USER_ALREADY_EXISTS);
    }
    const hashedPassword = await Crypto.hash(req.password);
    const userRoot = UserRoot.create({
      id: guid(),
      account: req.account,
      password: hashedPassword,
      username: req.username,
    });
    const user = await this._userRepository.create(userRoot);
    return new OkReturn({
      account: user.account,
      username: user.username,
    });
  }
}

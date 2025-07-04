import { inject } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { RegisterCommand } from "./register-command";
import { UserExistError } from "./user-exist-error";
import { SuccessReturn } from "../../../success-return";
import { Crypto } from "../../../../../lib/utils/crypto";
import { IBaseReturn } from "../../../../../lib/application/interfaces/base-return.interface";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { UserRoot } from "../../../../domain/user/user.root";
import { guid } from "../../../../../lib/utils/guid";
import { HandleFor } from "../../../../../lib/mediator/mediator.decorator";
import { TrackMethodCalls } from "../../../../../lib/utils/trace-method-calls";

@HandleFor(RegisterCommand)
@TrackMethodCalls()
export class RegisterHandler
  implements IReqHandler<RegisterCommand, IBaseReturn>
{
  constructor(
    @inject(UserRepository) private readonly _userRepository: IUserRepository,
  ) {}

  async handle(req: RegisterCommand): Promise<IBaseReturn> {
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

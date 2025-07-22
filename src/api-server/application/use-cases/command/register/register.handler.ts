import { RegisterCommand } from "./register.command"; import { RegisterError, RegisterResult } from "./register.result";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { ErrorCodes } from "../../../error-codes";
import { bcrypt } from "../../../../../lib/crypto";
import { UserRoot } from "../../../../domain/user/user.root";
import { ErrorReturn, HandleFor, inject, IReqHandler, OkReturn, OneOf, TrackClassMethods, uuid } from "empack";

@HandleFor(RegisterCommand)
@TrackClassMethods()
export class RegisterHandler
  implements IReqHandler<RegisterCommand, OneOf<RegisterResult, RegisterError>>
{
  constructor(
    @inject(UserRepository) private readonly _userRepository: IUserRepository,
  ) {}

  async handle(req: RegisterCommand): Promise<OneOf<RegisterResult, RegisterError>> {
    const isUserExist =
      (await this._userRepository.getByAccount(req.account)) !== null;
    if (isUserExist) {
      return new ErrorReturn(ErrorCodes.USER_ALREADY_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(req.password, 10);
    const userRoot = UserRoot.create({
      id: uuid(),
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

import { inject, injectable } from "inversify";
import { IReqHandler } from "../../../../../lib/mediatorLib/interfaces/IReqHandler";
import { RegisterCommand } from "./registerCommand";
import { UserRepository } from "../../../../infraLayer/repositories/userRepository";
import { IUserRepository } from "../../../persistence/IUserRepository";
import { UserRoot } from "../../../../domainLayer/user/userRoot";
import { UserExsistError } from "./userExsistError";
import { CryptoService } from "../../../services/cryptoService";
import { RegisterResult } from "./registerResult";
import { SuccessReturn } from "../../../SuccessReturn";
import { BaseReturn } from "../../../../../lib/applicationLib/baseReturn";

@injectable()
export class RegisterHandler implements IReqHandler<RegisterCommand, BaseReturn> {
  constructor(
    @inject(UserRepository) private readonly _userRepository: IUserRepository,
  ) {}

  async handle(req: RegisterCommand): Promise<BaseReturn> {
    const isUserExist =
      (await this._userRepository.getByAccount(req.account)) !== null;
    if (isUserExist) {
      return new UserExsistError();
    }
    const hashedPassword = await CryptoService.hash(req.password);
    const userRoot = UserRoot.create({
      account: req.account,
      password: hashedPassword,
      username: req.username
    });
    const user = await this._userRepository.create(userRoot);
    return new SuccessReturn(new RegisterResult(user.account, user.username));
  }
}

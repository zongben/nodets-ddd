import { inject, injectable } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { RegisterCommand } from "./register-command";
import { UserRepository } from "../../../../infra/repositories/user-repository";
import { IUserRepository } from "../../../persistences/user-repository.interface";
import { BaseReturn } from "../../../../../lib/application/base-return";
import { UserExsistError } from "./user-exsist-error";
import { CryptoService } from "../../../services/crypto-service";
import { UserRoot } from "../../../../domain/user/user-root";
import { SuccessReturn } from "../../../success-return";
import { RegisterResult } from "./register-result";

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

import { inject, injectable } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { LoginCommand } from "./login-command";
import { MEDIATOR_TYPES } from "../../../../../lib/mediator/types";
import { IPublisher } from "../../../../../lib/mediator/interfaces/publisher.interface";
import { UserRepository } from "../../../../infra/repositories/user-repository";
import { IUserRepository } from "../../../persistences/user-repository.interface";
import { JWT_TYPES } from "../../../../../lib/jwToken/types";
import { IJwTokenHelper } from "../../../../../lib/jwToken/interfaces/jwtoken-helper.interface";
import { LoginFailError } from "./login-fail-error";
import { LoginFailedEvent } from "./events/login-failed-event";
import { SuccessReturn } from "../../../success-return";
import { IBaseReturn } from "../../../../../lib/application/interfaces/base-return.interface";

@injectable()
export class LoginHandler implements IReqHandler<LoginCommand, IBaseReturn> {
  constructor(
    @inject(MEDIATOR_TYPES.IPublisher) private _publisher: IPublisher,
    @inject(UserRepository) private _userRepository: IUserRepository,
    @inject(JWT_TYPES.IJwTokenHelper) private _jwt: IJwTokenHelper,
  ) {}

  async handle(req: LoginCommand): Promise<IBaseReturn> {
    const user = await this._userRepository.getByAccount(req.account);
    if (!user) return new LoginFailError();

    const isPasswordCorrect = await user.isPasswordCorrect(req.password);

    if (!isPasswordCorrect) {
      this._publisher.publish(new LoginFailedEvent(req.account));
      return new LoginFailError();
    }

    const token = this._jwt.generateToken({ account: user.account, username: user.username });
    return new SuccessReturn({ token });
  }
}

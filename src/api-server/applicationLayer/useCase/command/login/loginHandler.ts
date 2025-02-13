import { inject, injectable } from "inversify";
import { IReqHandler } from "../../../../../lib/mediatorLib/interfaces/IReqHandler";
import { LoginCommand } from "./loginCommand";
import { MEDIATOR_TYPES } from "../../../../../lib/mediatorLib/types";
import { IPublisher } from "../../../../../lib/mediatorLib/interfaces/IPublisher";
import { LoginFailedEvent } from "./events/loginFailedEvent";
import { UserRepository } from "../../../../infraLayer/repositories/userRepository";
import { LoginFailError } from "./loginFailError";
import { IUserRepository } from "../../../persistence/IUserRepository";
import { JWT_TYPES } from "../../../../../lib/jwTokenLib/types";
import { IJwTokenHelper } from "../../../../../lib/jwTokenLib/interfaces/IJwTokenHelper";
import { SuccessReturn } from "../../../SuccessReturn";
import { BaseReturn } from "../../../../../lib/applicationLib/baseReturn";

@injectable()
export class LoginHandler implements IReqHandler<LoginCommand, BaseReturn> {
  constructor(
    @inject(MEDIATOR_TYPES.IPublisher) private _publisher: IPublisher,
    @inject(UserRepository) private _userRepository: IUserRepository,
    @inject(JWT_TYPES.IJwTokenHelper) private _jwt: IJwTokenHelper,
  ) {}

  async handle(req: LoginCommand): Promise<BaseReturn> {
    const user = await this._userRepository.getByAccount(req.account);
    if (!user) return new LoginFailError();

    const isPasswordCorrect = await user.isPasswordCorrect(req.password);

    if (!isPasswordCorrect) {
      this._publisher.publish(new LoginFailedEvent(req.account));
      return new LoginFailError();
    }

    const token = this._userRepository.getValidToken(user, this._jwt);
    return new SuccessReturn({ token });
  }
}

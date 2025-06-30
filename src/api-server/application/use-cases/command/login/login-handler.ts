import { inject } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { LoginCommand } from "./login-command";
import { MEDIATOR_TYPES } from "../../../../../lib/mediator/types";
import { IPublisher } from "../../../../../lib/mediator/interfaces/publisher.interface";
import { LoginFailError } from "./login-fail-error";
import { LoginFailedEvent } from "./events/login-failed-event";
import { SuccessReturn } from "../../../success-return";
import { IBaseReturn } from "../../../../../lib/application/interfaces/base-return.interface";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";
import { Handler } from "../../../../../lib/mediator/mediator.decorator";
import { IJwTokenHelper } from "../../../../../lib/jwToken/interfaces/jwtoken-helper.interface";
import { JWT_TYPES } from "../../../../infra/jwtHelpers/types";

@Handler(LoginCommand)
export class LoginHandler implements IReqHandler<LoginCommand, IBaseReturn> {
  constructor(
    @inject(MEDIATOR_TYPES.IPublisher) private _publisher: IPublisher,
    @inject(UserRepository) private _userRepository: IUserRepository,
    @inject(JWT_TYPES.ACCESSTOKEN)
    private _accessTokenHelper: IJwTokenHelper,
    @inject(JWT_TYPES.REFRESHTOKEN)
    private _refreshTokenHelper: IJwTokenHelper,
  ) {}

  async handle(req: LoginCommand): Promise<IBaseReturn> {
    const user = await this._userRepository.getByAccount(req.account);
    if (!user) return new LoginFailError();

    const isPasswordCorrect = await user.isPasswordCorrect(req.password);
    if (!isPasswordCorrect) {
      await this._publisher.publish(new LoginFailedEvent(req.account));
      return new LoginFailError();
    }

    const accessToken = this._accessTokenHelper.generateToken({
      userid: user.id,
      account: user.account,
      username: user.username,
    });

    const refreshToken = this._refreshTokenHelper.generateToken({
      userid: user.id,
    });
    return new SuccessReturn({ accessToken, refreshToken });
  }
}

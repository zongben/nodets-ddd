import { inject, injectable } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { LoginCommand } from "./login-command";
import { MEDIATOR_TYPES } from "../../../../../lib/mediator/types";
import { IPublisher } from "../../../../../lib/mediator/interfaces/publisher.interface";
import { LoginFailError } from "./login-fail-error";
import { LoginFailedEvent } from "./events/login-failed-event";
import { SuccessReturn } from "../../../success-return";
import { IBaseReturn } from "../../../../../lib/application/interfaces/base-return.interface";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { JWT_TYPES } from "../../../../infra/jwtoken-setting/types";
import { IJwTokenSettings } from "../../../../../lib/jwToken/interfaces/jwtoken-settings.interface";
import { JwTokenHelper } from "../../../../../lib/jwToken/jwtoken-helper";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";

@injectable()
export class LoginHandler implements IReqHandler<LoginCommand, IBaseReturn> {
  constructor(
    @inject(MEDIATOR_TYPES.IPublisher) private _publisher: IPublisher,
    @inject(UserRepository) private _userRepository: IUserRepository,
    @inject(JWT_TYPES.ACCESSTOKEN) private _accessTokenSetting: IJwTokenSettings,
    @inject(JWT_TYPES.REFRESHTOKEN) private _refreshTokenSetting: IJwTokenSettings
  ) {}

  async handle(req: LoginCommand): Promise<IBaseReturn> {
    const user = await this._userRepository.getByAccount(req.account);
    if (!user) return new LoginFailError();

    const isPasswordCorrect = await user.isPasswordCorrect(req.password);

    if (!isPasswordCorrect) {
      this._publisher.publish(new LoginFailedEvent(req.account));
      return new LoginFailError();
    }

    const accessTokenHelper = new JwTokenHelper(this._accessTokenSetting);
    const accessToken = accessTokenHelper.generateToken({
      userid: user.id,
      account: user.account,
      username: user.username,
    });

    const refreshTokenHelper = new JwTokenHelper(this._refreshTokenSetting);
    const refreshToken = refreshTokenHelper.generateToken({
      userid: user.id
    });
    return new SuccessReturn({ accessToken, refreshToken });
  }
}

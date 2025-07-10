import { inject } from "inversify";
import { IReqHandler } from "../../../../../lib/mediator/interfaces/req-handler.interface";
import { MEDIATOR_TYPES } from "../../../../../lib/mediator/types";
import { IPublisher } from "../../../../../lib/mediator/interfaces/publisher.interface";
import { LoginFailedEvent } from "./events/login-failed-event";
import { IUserRepository } from "../../../persistences/user.repository.interface";
import { UserRepository } from "../../../../infra/repositories/user.repository.prisma";
import { HandleFor } from "../../../../../lib/mediator/mediator.decorator";
import { IJwTokenHelper } from "../../../../../lib/jwToken/interfaces/jwtoken-helper.interface";
import { JWT_TYPES } from "../../../../infra/jwtHelpers/types";
import { BaseResult } from "../../../../../lib/application/result.type";
import { LoginCommand } from "./login.command";
import { TrackClassMethods } from "../../../../../lib/utils/tracker";
import { SuccessReturn } from "../../../../../lib/application/success-return";
import { FailReturn } from "../../../../../lib/application/fail-return";
import { ErrorCodes } from "../../../error-codes";
import { LoginResult } from "./loing.result";

@HandleFor(LoginCommand)
@TrackClassMethods()
export class LoginHandler
  implements IReqHandler<LoginCommand, BaseResult<LoginResult>>
{
  constructor(
    @inject(MEDIATOR_TYPES.IPublisher) private _publisher: IPublisher,
    @inject(UserRepository) private _userRepository: IUserRepository,
    @inject(JWT_TYPES.ACCESSTOKEN)
    private _accessTokenHelper: IJwTokenHelper,
    @inject(JWT_TYPES.REFRESHTOKEN)
    private _refreshTokenHelper: IJwTokenHelper,
  ) {}

  async handle(req: LoginCommand): Promise<BaseResult<LoginResult>> {
    const user = await this._userRepository.getByAccount(req.account);
    if (!user) return new FailReturn(ErrorCodes.ACCOUNT_OR_PASSWORD_INCORRECT);

    const isPasswordCorrect = await user.isPasswordCorrect(req.password);
    if (!isPasswordCorrect) {
      await this._publisher.publish(new LoginFailedEvent(req.account));
      return new FailReturn(ErrorCodes.ACCOUNT_OR_PASSWORD_INCORRECT);
    }

    const accessToken = this._accessTokenHelper.generateToken({
      userid: user.id,
      account: user.account,
      username: user.username,
    });

    const refreshToken = this._refreshTokenHelper.generateToken({
      userid: user.id,
    });
    return new SuccessReturn({
      accessToken,
      refreshToken,
    });
  }
}

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
import { Result } from "../../../../../lib/application/result.type";
import { LoginCommand } from "./login.command";
import { TrackClassMethods } from "../../../../../lib/utils/tracker";
import { FailReturn } from "../../../../../lib/application/fail-return";
import { ErrorCodes } from "../../../error-codes";
import { LoginError, LoginResult } from "./loing.result";
import { OkReturn } from "../../../../../lib/application/ok-return";

@HandleFor(LoginCommand)
@TrackClassMethods()
export class LoginHandler
  implements IReqHandler<LoginCommand, Result<LoginResult, LoginError>>
{
  constructor(
    @inject(MEDIATOR_TYPES.IPublisher) private _publisher: IPublisher,
    @inject(UserRepository) private _userRepository: IUserRepository,
    @inject(JWT_TYPES.ACCESSTOKEN)
    private _accessTokenHelper: IJwTokenHelper,
    @inject(JWT_TYPES.REFRESHTOKEN)
    private _refreshTokenHelper: IJwTokenHelper,
  ) {}

  async handle(
    req: LoginCommand,
  ): Promise<Result<LoginResult, LoginError>> {
    const user = await this._userRepository.getByAccount(req.account);
    if (!user)
      return new FailReturn<LoginError>(
        ErrorCodes.ACCOUNT_OR_PASSWORD_INCORRECT,
      );

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
    return new OkReturn({
      accessToken,
      refreshToken,
    });
  }
}

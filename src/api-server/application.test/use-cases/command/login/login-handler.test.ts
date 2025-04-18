import { IJwTokenHelper } from "../../../../../lib/jwToken/interfaces/jwtoken-helper.interface";
import { IPublisher } from "../../../../../lib/mediator/interfaces/publisher.interface";
import { SuccessReturn } from "../../../../application/success-return";
import { LoginFailError } from "../../../../application/use-cases/command/login/login-fail-error";
import { LoginHandler } from "../../../../application/use-cases/command/login/login-handler";
import { Crypto } from "../../../../../lib/utils/crypto";
import { IUserRepository } from "../../../../application/persistences/user.repository.interface";
import { UserRoot } from "../../../../domain/user/user.root";
import { AccesTokenSetting } from "../../../../infra/jwtoken-setting/jwtoken-setting";

let mockUserRepository: IUserRepository;
let mockPublisher: IPublisher;
let mockJwTokenHelper: IJwTokenHelper;
const mockAccessTokenSettings = new AccesTokenSetting("test")
const mockRefreshTokenSettings = new AccesTokenSetting("test")

describe("LoginHandler", () => {
  beforeEach(() => {
    mockUserRepository = {} as IUserRepository;
    mockJwTokenHelper = {} as IJwTokenHelper;
    mockPublisher = {} as IPublisher;
    mockPublisher.publish = jest.fn();
  });

  test("when user is not found, should return LoginFailError", async () => {
    mockUserRepository.getByAccount = jest.fn().mockResolvedValue(null);

    const loginHandler = new LoginHandler(
      mockPublisher,
      mockUserRepository,
      mockAccessTokenSettings,
      mockRefreshTokenSettings,
    );
    const result = await loginHandler.handle({
      account: "account",
      password: "password",
    });

    expect(result).toBeInstanceOf(LoginFailError);
    expect(mockPublisher.publish).not.toHaveBeenCalled();
  });

  test("when password is incorrect, should return LoginFailError", async () => {
    mockUserRepository.getByAccount = jest.fn().mockResolvedValue(
      UserRoot.create({
        id: "id",
        account: "account",
        password: "password",
        username: "username",
      }),
    );

    const loginHandler = new LoginHandler(
      mockPublisher,
      mockUserRepository,
      mockAccessTokenSettings,
      mockRefreshTokenSettings,
    );
    const result = await loginHandler.handle({
      account: "account",
      password: "incorrectPassword",
    });

    expect(result).toBeInstanceOf(LoginFailError);
    expect(mockPublisher.publish).toHaveBeenCalled();
  });

  test("when password is correct, should return token", async () => {
    const password = await Crypto.hash("password");

    mockUserRepository.getByAccount = jest.fn().mockResolvedValue(
      UserRoot.create({
        id: "id",
        account: "account",
        password,
        username: "username",
      }),
    );

    mockJwTokenHelper.generateToken = jest.fn().mockReturnValue("token");

    const loginHandler = new LoginHandler(
      mockPublisher,
      mockUserRepository,
      mockAccessTokenSettings,
      mockRefreshTokenSettings,
    );
    const result = await loginHandler.handle({
      account: "account",
      password: "password",
    });

    expect(result).toBeInstanceOf(SuccessReturn);
    expect(mockPublisher.publish).not.toHaveBeenCalled();
  });
});

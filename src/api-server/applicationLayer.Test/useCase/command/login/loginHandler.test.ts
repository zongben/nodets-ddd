import { IJwTokenHelper } from "../../../../../lib/jwTokenLib/interfaces/IJwTokenHelper";
import { IPublisher } from "../../../../../lib/mediatorLib/interfaces/IPublisher";
import { IUserRepository } from "../../../../applicationLayer/persistence/IUserRepository";
import { CryptoService } from "../../../../applicationLayer/services/cryptoService";
import { SuccessReturn } from "../../../../applicationLayer/SuccessReturn";
import { LoginFailError } from "../../../../applicationLayer/useCase/command/login/loginFailError";
import { LoginHandler } from "../../../../applicationLayer/useCase/command/login/loginHandler";
import { UserRoot } from "../../../../domainLayer/user/userRoot";

let mockUserRepository: IUserRepository;
let mockPublisher: IPublisher;
let mockJwTokenHelper: IJwTokenHelper;

describe("LoginHandler", () => {
  beforeEach(() => {
    mockUserRepository = {} as IUserRepository;
    mockJwTokenHelper = {} as IJwTokenHelper;
    mockPublisher = {} as IPublisher;
    mockPublisher.publish = jest.fn();
  });

  test("when user is not found, should return LoginFailError", async () => {
    mockUserRepository.getByAccount = jest
      .fn(mockUserRepository.getByAccount)
      .mockResolvedValue(null);

    const loginHandler = new LoginHandler(
      mockPublisher,
      mockUserRepository,
      mockJwTokenHelper,
    );
    const result = await loginHandler.handle({
      account: "account",
      password: "password",
    });

    expect(result).toBeInstanceOf(LoginFailError);
    expect(mockPublisher.publish).not.toHaveBeenCalled();
  });

  test("when password is incorrect, should return LoginFailError", async () => {
    mockUserRepository.getByAccount = jest
      .fn(mockUserRepository.getByAccount)
      .mockResolvedValue(
        UserRoot.create({
          account: "account",
          password: "password",
          username: "username",
        }),
      );

    const loginHandler = new LoginHandler(
      mockPublisher,
      mockUserRepository,
      mockJwTokenHelper,
    );
    const result = await loginHandler.handle({
      account: "account",
      password: "incorrectPassword",
    });

    expect(result).toBeInstanceOf(LoginFailError);
    expect(mockPublisher.publish).toHaveBeenCalled();
  });

  test("when password is correct, should return token", async () => {
    const password = await CryptoService.hash("password");

    mockUserRepository.getByAccount = jest
      .fn(mockUserRepository.getByAccount)
      .mockResolvedValue(
        UserRoot.create({
          account: "account",
          password,
          username: "username",
        }),
      );

    mockUserRepository.getValidToken = jest
      .fn(mockUserRepository.getValidToken)
      .mockReturnValue("token");

    const loginHandler = new LoginHandler(
      mockPublisher,
      mockUserRepository,
      mockJwTokenHelper,
    );
    const result = await loginHandler.handle({
      account: "account",
      password: "password",
    });

    expect(result).toBeInstanceOf(SuccessReturn);
    expect(mockPublisher.publish).not.toHaveBeenCalled();
  });
});

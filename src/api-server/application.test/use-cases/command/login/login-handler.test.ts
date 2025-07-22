import { IUserRepository } from "../../../../application/persistences/user.repository.interface";
import { LoginHandler } from "../../../../application/use-cases/command/login/login.handler";
import { ErrorCodes } from "../../../../application/error-codes";
import { UserRoot } from "../../../../domain/user/user.root";
import { bcrypt } from "../../../../../lib/crypto";
import { IJwTokenHelper, IPublisher } from "empack";

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
    mockUserRepository.getByAccount = jest.fn().mockResolvedValue(null);

    const loginHandler = new LoginHandler(
      mockPublisher,
      mockUserRepository,
      mockJwTokenHelper,
      mockJwTokenHelper,
    );
    const result = await loginHandler.handle({
      account: "account",
      password: "password",
    });

    expect(result.isSuccess).toBe(false);
    if (!result.isSuccess) {
      expect(result.error).toBe(ErrorCodes.ACCOUNT_OR_PASSWORD_INCORRECT);
    }
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
      mockJwTokenHelper,
      mockJwTokenHelper,
    );
    const result = await loginHandler.handle({
      account: "account",
      password: "incorrectPassword",
    });

    expect(result.isSuccess).toBe(false);
    if (!result.isSuccess) {
      expect(result.error).toBe(ErrorCodes.ACCOUNT_OR_PASSWORD_INCORRECT);
    }
    expect(mockPublisher.publish).toHaveBeenCalled();
  });

  test("when password is correct, should return token", async () => {
    const password = await bcrypt.hash("password", 10);

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
      mockJwTokenHelper,
      mockJwTokenHelper,
    );
    const result = await loginHandler.handle({
      account: "account",
      password: "password",
    });

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.data.accessToken).toBeDefined();
      expect(result.data.refreshToken).toBeDefined();
    }
    expect(mockPublisher.publish).not.toHaveBeenCalled();
  });
});

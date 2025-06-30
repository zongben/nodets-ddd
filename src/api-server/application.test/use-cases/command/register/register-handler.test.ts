import { MESSAGE_CODES } from "../../../../application/message-codes";
import { IUserRepository } from "../../../../application/persistences/user.repository.interface";
import { RegisterHandler } from "../../../../application/use-cases/command/register/register-handler";
import { UserRoot } from "../../../../domain/user/user.root";

let mockUserRepository: IUserRepository;

describe("registerHandler", () => {
  beforeEach(() => {
    mockUserRepository = {} as IUserRepository;
  });

  test("when user not found then create user", async () => {
    mockUserRepository.getByAccount = jest.fn().mockResolvedValue(null);

    mockUserRepository.create = jest.fn().mockResolvedValue({} as UserRoot);

    const registerHandler = new RegisterHandler(mockUserRepository);
    const result = await registerHandler.handle({
      account: "account",
      password: "password",
      username: "username",
    });

    expect(result.isSuccess).toBe(true);
  });

  test("when user found then return error", async () => {
    mockUserRepository.getByAccount = jest
      .fn()
      .mockResolvedValue({} as UserRoot);

    const registerHandler = new RegisterHandler(mockUserRepository);
    const result = await registerHandler.handle({
      account: "account",
      password: "password",
      username: "username",
    });

    expect(result.isSuccess).toBe(false);
    expect(result.messageCode).toBe(MESSAGE_CODES.USER_ALREADY_EXISTS);
  });
});

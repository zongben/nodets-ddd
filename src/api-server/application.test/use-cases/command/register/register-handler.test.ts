import { ErrorCodes } from "../../../../application/error-codes";
import { IUserRepository } from "../../../../application/persistences/user.repository.interface";
import { RegisterHandler } from "../../../../application/use-cases/command/register/register.handler";
import { UserRoot } from "../../../../domain/user/user.root";

let mockUserRepository: IUserRepository;

describe("registerHandler", () => {
  beforeEach(() => {
    mockUserRepository = {} as IUserRepository;
  });

  test("when user not found then create user", async () => {
    mockUserRepository.getByAccount = jest.fn().mockResolvedValue(null);

    mockUserRepository.create = jest.fn().mockResolvedValue({
      id: "id",
      account: "account",
      username: "username",
    } as UserRoot);

    const registerHandler = new RegisterHandler(mockUserRepository);
    const result = await registerHandler.handle({
      account: "account",
      password: "password",
      username: "username",
    });

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.data).toEqual({
        account: "account",
        username: "username",
      });
    }
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
    if (!result.isSuccess) {
      expect(result.errorCode).toBe(ErrorCodes.USER_ALREADY_EXISTS);
    }
  });
});

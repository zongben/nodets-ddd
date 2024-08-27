import { IUserRepository } from "../../../../application/persistences/user.repository.interface";
import { GetUserHandler } from "../../../../application/use-cases/query/get-user/get-user-handler";
import { GetUserQuery } from "../../../../application/use-cases/query/get-user/get-user-query";
import { GetUserResult } from "../../../../application/use-cases/query/get-user/get-user-result";
import { UserNotExsistError } from "../../../../application/use-cases/query/get-user/user-not-exsist-error";

let mockUserRepository: IUserRepository;

describe("getuserHandler", () => {
  beforeEach(() => {
    mockUserRepository = {} as IUserRepository;
  });

  test("when user not exists return error", async () => {
    const query = new GetUserQuery("id");

    mockUserRepository.getById = jest.fn().mockResolvedValue(null);

    const handler = new GetUserHandler(mockUserRepository);
    const result = await handler.handle(query);

    expect(result).toBeInstanceOf(UserNotExsistError);
  });

  test("when user exists return user", async () => {
    const query = new GetUserQuery("id");

    mockUserRepository.getById = jest.fn().mockResolvedValue({
      id: "id",
      account: "account",
      username: "username",
    });

    const handler = new GetUserHandler(mockUserRepository);
    const result = await handler.handle(query);

    const getUserResult = new GetUserResult("id", "account", "username");
    expect(result.data).toEqual(getUserResult);
  });
});

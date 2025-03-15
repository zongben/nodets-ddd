import { injectable } from "inversify";
import { IUserRepository } from "../../application/persistences/user-repository.interface";
import { UserRoot } from "../../domain/user/user-root";
import { User } from "../db-entities/user";

@injectable()
export class UserRepository implements IUserRepository {
  async create(user: UserRoot): Promise<UserRoot> {
    const model = new User();
    model.account = user.account;
    model.password = user.password;
    model.name = user.username;
    await model.save();
    return user;
  }

  async getByAccount(account: string): Promise<UserRoot | null> {
    const user = await User.findOneBy({ account });
    if (!user) return null;
    return UserRoot.create({
      account: user.account,
      password: user.password,
      username: user.name,
    });
  }
}

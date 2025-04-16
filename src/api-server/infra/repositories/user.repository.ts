import { inject, injectable } from "inversify";
import { IUserRepository } from "../../application/persistences/user-repository.interface";
import { UserRoot } from "../../domain/user/user-root";
import { IMongo } from "../../../lib/mongoDB/interfaces/mongo.interface";
import { COLLECTIONS } from "../schemas/collections.enum";
import { MONGO_TYPES } from "../../../lib/mongoDB/types";
import { IUser } from "../schemas/user.schema";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(MONGO_TYPES.IMongo) private readonly _mongo: IMongo) {}

  async create(user: UserRoot): Promise<UserRoot> {
    const model = this._mongo.getModel<IUser>(COLLECTIONS.USER);
    const userModel = new model({
      account: user.account,
      password: user.password,
      username: user.username,
    });
    await userModel.save();
    return user;
  }

  async getByAccount(account: string): Promise<UserRoot | null> {
    const model = this._mongo.getModel<IUser>(COLLECTIONS.USER);
    const user = await model.findOne({ account });
    if (!user) return null;
    return UserRoot.create({
      account: user.account,
      password: user.password,
      username: user.username,
    });
  }
}

import { inject, injectable } from "inversify";
import { IMongo } from "../../../lib/mongoDB/interfaces/mongo.interface";
import { COLLECTIONS } from "../schemas/collections.enum";
import { MONGO_TYPES } from "../../../lib/mongoDB/types";
import { IUser } from "../schemas/user.schema";
import { MongoBuilder } from "../../../lib/mongoDB/mongo-builder";
import { IUserRepository } from "../../application/persistences/user.repository.interface";
import { UserRoot } from "../../domain/user/user.root";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(MONGO_TYPES.IMongo) private readonly _mongo: IMongo) {}

  async create(user: UserRoot): Promise<UserRoot> {
    const model = this._mongo.getModel<IUser>(COLLECTIONS.USER);
    const userModel = new model({
      id: user.id,
      account: user.account,
      password: user.password,
      username: user.username,
    });
    await userModel.save();
    return user;
  }

  async getByAccount(account: string): Promise<UserRoot | null> {
    const model = this._mongo.getModel<IUser>(COLLECTIONS.USER);
    const user = await MongoBuilder.create(model)
      .Where({ account })
      .QueryFirstOrDefault();

    if (!user) return null;
    return UserRoot.create({
      id: user.id,
      account: user.account,
      password: user.password,
      username: user.username,
    });
  }

  async getById(id: string): Promise<UserRoot | null> {
    const model = this._mongo.getModel<IUser>(COLLECTIONS.USER);
    const user = await MongoBuilder.create(model)
      .Where({ id })
      .QueryFirstOrDefault();

    if (!user) return null;
    return UserRoot.create({
      id: user.id,
      account: user.account,
      password: user.password,
      username: user.username,
    });
  }
}

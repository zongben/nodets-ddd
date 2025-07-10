import { injectable } from "inversify";
import { IUserRepository } from "../../application/persistences/user.repository.interface";
import { UserRoot } from "../../domain/user/user.root";
import { prisma } from "../prisma/client";
import { TrackClassMethods } from "../../../lib/utils/tracker";

@injectable()
@TrackClassMethods()
export class UserRepository implements IUserRepository {
  async create(user: UserRoot): Promise<UserRoot> {
    await prisma.user.create({
      data: {
        id: user.id,
        account: user.account,
        password: user.password,
        username: user.username,
      },
    });
    return user;
  }

  async getByAccount(account: string): Promise<UserRoot | null> {
    const user = await prisma.user.findUnique({
      where: {
        account: account,
      },
    });

    if (!user) return null;
    return UserRoot.create({
      id: user.id,
      account: user.account,
      password: user.password,
      username: user.username,
    });
  }

  async getById(id: string): Promise<UserRoot | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) return null;
    return UserRoot.create({
      id: user.id,
      account: user.account,
      password: user.password,
      username: user.username,
    });
  }
}

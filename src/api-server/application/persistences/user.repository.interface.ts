import { UserRoot } from "../../domain/user/user.root.js";

export interface IUserRepository {
  create(user: UserRoot): Promise<UserRoot>;
  getByAccount(account: string): Promise<UserRoot | null>;
  getById(id: string): Promise<UserRoot | null>;
}

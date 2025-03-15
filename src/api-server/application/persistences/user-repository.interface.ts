import { IJwTokenHelper } from "../../../lib/jwToken/interfaces/jwtoken-helper.interface";
import { UserRoot } from "../../domain/user/user-root";

export interface IUserRepository {
  create(user: UserRoot): Promise<UserRoot>;
  getByAccount(account: string): Promise<UserRoot | null>;
  getValidToken(user: UserRoot, jwt: IJwTokenHelper): string;
}

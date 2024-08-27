import { Crypto } from "../../../lib/utils/crypto";

export class UserRoot {
  id: string;
  account: string;
  password: string;
  username: string;

  private constructor(props: {
    id: string;
    account: string;
    password: string;
    username: string;
  }) {
    this.id = props.id;
    this.account = props.account;
    this.password = props.password;
    this.username = props.username;
  }

  static create(props: {
    id: string;
    account: string;
    password: string;
    username: string;
  }): UserRoot {
    return new UserRoot(props);
  }

  async isPasswordCorrect(password: string): Promise<boolean> {
    return await Crypto.compare(password, this.password);
  }
}

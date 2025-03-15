import { CryptoService } from "../../application/services/crypto-service";

export class UserRoot {
  account: string;
  password: string;
  username: string;

  private constructor(props: {
    account: string;
    password: string;
    username: string;
  }) {
    this.account = props.account;
    this.password = props.password;
    this.username = props.username;
  }

  static create(props: {
    account: string;
    password: string;
    username: string;
  }): UserRoot {
    return new UserRoot(props);
  }

  async isPasswordCorrect(password: string): Promise<boolean> {
    return await CryptoService.compare(password, this.password);
  }
}

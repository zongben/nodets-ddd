import { MediatorMap } from "../../lib/mediator/mediator.map";
import { LoginCommand } from "./use-cases/command/login/login-command";
import { LoginHandler } from "./use-cases/command/login/login-handler";
import { RegisterCommand } from "./use-cases/command/register/register-command";
import { RegisterHandler } from "./use-cases/command/register/register-handler";
import { GetUserHandler } from "./use-cases/query/get-user/get-user-handler";
import { GetUserQuery } from "./use-cases/query/get-user/get-user-query";

export class HandlerMap extends MediatorMap {
  constructor() {
    super();
    this.set(RegisterCommand, RegisterHandler);
    this.set(LoginCommand, LoginHandler);
    this.set(GetUserQuery, GetUserHandler);
  }
}

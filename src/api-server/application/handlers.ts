import { LoginHandler } from "./use-cases/command/login/login.handler";
import { RegisterHandler } from "./use-cases/command/register/register.handler";
import { GetUserHandler } from "./use-cases/query/get-user/get-user.handler";

export const handlers = [RegisterHandler, LoginHandler, GetUserHandler];

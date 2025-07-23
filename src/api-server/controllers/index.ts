import { AuthController } from "./auth.controller";
import { ChatWebSocketController } from "./chat.websocket";
import { UserController } from "./user.controller";

export const controllers = [AuthController, UserController];

export const wsController = [ChatWebSocketController];

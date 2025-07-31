import { IWebSocket, RawData, WebSocketContext, WsController } from "@empackjs/core";

@WsController("/chat")
export class ChatWebSocketController implements IWebSocket {
  onConnected(ctx: WebSocketContext): void | Promise<void> {
    ctx.send("chat connected");
  }

  onMessage(ctx: WebSocketContext, data: RawData): void | Promise<void> {
    ctx.send(`response from server your data:${data}`);
  }
}

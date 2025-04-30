import { injectable } from "inversify";
import { IEventHandler } from "../../../../lib/mediator/interfaces/event-handler.interface";
import { LoginFailedEvent } from "../../use-cases/command/login/events/login-failed-event";

@injectable()
export class SendNotification implements IEventHandler<LoginFailedEvent> {
  async handle(event: LoginFailedEvent): Promise<void> {
    console.log("SendNotification", event.account);
  }
}

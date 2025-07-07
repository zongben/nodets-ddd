import { injectable } from "inversify";
import { IEventHandler } from "../../../../lib/mediator/interfaces/event-handler.interface";
import { LoginFailedEvent } from "../../use-cases/command/login/events/login-failed-event";
import { TrackClassMethods } from "../../../../lib/utils/track";

@injectable()
@TrackClassMethods()
export class SendNotification implements IEventHandler<LoginFailedEvent> {
  async handle(event: LoginFailedEvent): Promise<void> {
    console.log("SendNotification", event.account);
  }
}

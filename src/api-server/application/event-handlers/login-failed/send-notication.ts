import { IEventHandler } from "empack/mediator";
import { TrackClassMethods } from "empack/utils";
import { injectable } from "inversify";
import { LoginFailedEvent } from "../../use-cases/command/login/events/login-failed-event.js";

@injectable()
@TrackClassMethods()
export class SendNotification implements IEventHandler<LoginFailedEvent> {
  async handle(event: LoginFailedEvent): Promise<void> {
    console.log("SendNotification", event.account);
  }
}

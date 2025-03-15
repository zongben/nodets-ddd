import { IEventHandler } from "../../../../../../lib/mediator/interfaces/event-handler.interface";
import { INotification } from "../../../../../../lib/mediator/interfaces/notification.interface";
import { SendNotification } from "../../../../event-handlers/login-failed/send-notication";

export class LoginFailedEvent implements INotification<LoginFailedEvent> {
  readonly account: string;

  constructor(account: string) {
    this.account = account;
  }

  getSubscribers(): (new (
    ...args: any[]
  ) => IEventHandler<LoginFailedEvent>)[] {
    return [SendNotification];
  }
}

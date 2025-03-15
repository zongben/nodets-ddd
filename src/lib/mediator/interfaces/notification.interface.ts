import { IEventHandler } from "./IEventHandler";

export interface INotification<T> {
  getSubscribers(): Array<new (...args: any[]) => IEventHandler<T>>;
}

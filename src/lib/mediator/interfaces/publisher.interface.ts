import { INotification } from "./INotification";

export interface IPublisher {
  publish<T extends INotification<T>>(event: T): Promise<void>;
}

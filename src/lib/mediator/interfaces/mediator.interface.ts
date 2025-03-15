import { IPublisher } from "./IPublisher";
import { ISender } from "./ISender";

export interface IMediator extends ISender, IPublisher {}

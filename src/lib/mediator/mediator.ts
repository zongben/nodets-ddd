import { Container, inject, injectable } from "inversify";
import { MEDIATOR_TYPES } from "./types";
import { IMediator } from "./interfaces/mediator.interface";
import { IMediatorMap } from "./interfaces/mediator-map.interface";
import { IReqHandler } from "./interfaces/req-handler.interface";
import { MediatorPipe } from "./mediator-pipe";
import { INotification } from "./interfaces/notification.interface";

@injectable()
export class Mediator implements IMediator {
  constructor(
    @inject(Container) private readonly _container: Container,
    @inject(MEDIATOR_TYPES.IMediatorMap)
    private readonly _mediatorMap: IMediatorMap,
    @inject(MEDIATOR_TYPES.Pipeline) private readonly _pipeline: any,
  ) {}

  send<TRes>(req: any): Promise<TRes> {
    const handler = this._mediatorMap.get(req.constructor) as new (
      ...args: any[]
    ) => IReqHandler<any, TRes>;
    if (!handler) {
      throw new Error("handler not found");
    }

    let index = 0;
    const pipeLength = this._pipeline.length;
    const next = async () => {
      if (index < pipeLength) {
        const pipe = this._container.resolve(
          this._pipeline[index++],
        ) as MediatorPipe;
        return await pipe.handle(req, next);
      } else {
        const handlerInstance = this._container.resolve(handler);
        console.log("send to handler:", handlerInstance.constructor.name);
        return await handlerInstance.handle(req);
      }
    };

    return next();
  }

  publish<T extends INotification<T>>(event: T): Promise<void> {
    for (const handler of event.getSubscribers()) {
      const handlerInstance = this._container.resolve(handler);
      console.log("publish to handler:", handlerInstance.constructor.name);
      handlerInstance.handle(event);
    }
    return Promise.resolve();
  }
}

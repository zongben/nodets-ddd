import { Container, injectable, interfaces } from "inversify";
import { Mediator } from "./mediator";
import { MEDIATOR_TYPES } from "./types";
import { MediatorPipe } from "./mediator-pipe";
import { IMediatorMap } from "./interfaces/mediator-map.interface";
import { IMediator } from "./interfaces/mediator.interface";
import { ISender } from "./interfaces/sender.interface";
import { IPublisher } from "./interfaces/publisher.interface";
import { Module } from "../container/container.module";
import { MediatorMap } from "./mediator.map";

@injectable()
export class MediatorModule extends Module {
  constructor(
    private readonly _container: Container,
    private readonly _mediatorMap: MediatorMap,
    private readonly _pipeline: (typeof MediatorPipe)[] = [],
  ) {
    super();
  }

  protected bindModule(
    fn: (
      regis: interfaces.ContainerModuleCallBack,
    ) => interfaces.ContainerModuleCallBack,
  ): interfaces.ContainerModuleCallBack {
    return fn((bind) => {
      bind<IMediatorMap>(MEDIATOR_TYPES.IMediatorMap).toConstantValue(
        this._mediatorMap,
      );
      bind<IMediator>(MEDIATOR_TYPES.IMediator).to(Mediator).inTransientScope();
      bind<ISender>(MEDIATOR_TYPES.ISender).to(Mediator).inTransientScope();
      bind<IPublisher>(MEDIATOR_TYPES.IPublisher)
        .to(Mediator)
        .inTransientScope();
      bind<Container>("container").toConstantValue(this._container);
      bind<(typeof MediatorPipe)[]>(MEDIATOR_TYPES.Pipeline).toConstantValue(
        this._pipeline,
      );
    });
  }
}

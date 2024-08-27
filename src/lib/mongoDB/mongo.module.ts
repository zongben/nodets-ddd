import { interfaces } from "inversify";
import { Module } from "../container/container.module";
import { IMongo } from "./interfaces/mongo.interface";
import { MONGO_TYPES } from "./types";
import { Mongo } from "./mongo";

export class MongoModule extends Module {
  constructor(private instance: Mongo) {
    super();
  }

  protected bindModule(
    fn: (
      regis: interfaces.ContainerModuleCallBack,
    ) => interfaces.ContainerModuleCallBack,
  ): interfaces.ContainerModuleCallBack {
    return fn((bind) => {
      bind<IMongo>(MONGO_TYPES.IMongo).toConstantValue(this.instance);
    });
  }
}

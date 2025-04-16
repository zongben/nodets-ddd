import { interfaces } from "inversify";
import { Module } from "../container/container-module";
import { IAppDataSource } from "./interfaces/app-data-source.interface";
import { APP_DATA_SOURCE_TYPE } from "./types";
import { AppDataSource } from "./app-data-source";

export class AppDataSourceModule extends Module {
  constructor(private instance: AppDataSource) {
    super();
  }

  protected bindModule(
    fn: (
      regis: interfaces.ContainerModuleCallBack,
    ) => interfaces.ContainerModuleCallBack,
  ): interfaces.ContainerModuleCallBack {
    return fn((bind) => {
      bind<IAppDataSource>(APP_DATA_SOURCE_TYPE.IAppDataSource).toConstantValue(
        this.instance,
      );
    });
  }
}

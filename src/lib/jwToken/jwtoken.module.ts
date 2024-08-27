import { interfaces } from "inversify";
import { Module } from "../container/container.module";
import { IJwTokenSettings } from "./interfaces/jwtoken-settings.interface";

export class JwTokenSettingModule extends Module {
  constructor(
    private symbol: symbol,
    private jwtSettings: IJwTokenSettings,
  ) {
    super();
  }

  protected bindModule(
    fn: (
      regis: interfaces.ContainerModuleCallBack,
    ) => interfaces.ContainerModuleCallBack,
  ): interfaces.ContainerModuleCallBack {
    return fn((bind) => {
      bind(this.symbol).toConstantValue(this.jwtSettings);
    });
  }
}

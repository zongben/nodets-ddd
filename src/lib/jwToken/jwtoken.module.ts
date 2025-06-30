import { interfaces } from "inversify";
import { Module } from "../container/container.module";
import { IJwTokenHelper } from "./interfaces/jwtoken-helper.interface";

export class JwTokenHelperModule extends Module {
  constructor(
    private symbol: symbol,
    private jwtHelper: IJwTokenHelper,
  ) {
    super();
  }

  protected bindModule(
    fn: (
      regis: interfaces.ContainerModuleCallBack,
    ) => interfaces.ContainerModuleCallBack,
  ): interfaces.ContainerModuleCallBack {
    return fn((bind) => {
      bind(this.symbol).toConstantValue(this.jwtHelper);
    });
  }
}

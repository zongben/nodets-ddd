import { interfaces } from "inversify";
import { JWT_TYPES } from "./types";
import { JwTokenSettings } from "./jwtoken-settings";
import { JwTokenHelper } from "./jwtoken-helper";
import { Module } from "../container/container.module";

export class JwTokenModule extends Module {
  constructor(private readonly jwtSettings: JwTokenSettings) {
    super();
  }

  protected bindModule(
    fn: (
      regis: interfaces.ContainerModuleCallBack,
    ) => interfaces.ContainerModuleCallBack,
  ): interfaces.ContainerModuleCallBack {
    return fn((bind) => {
      bind(JwTokenSettings).toConstantValue(this.jwtSettings);
      bind(JWT_TYPES.IJwTokenHelper).to(JwTokenHelper).inTransientScope();
    });
  }
}

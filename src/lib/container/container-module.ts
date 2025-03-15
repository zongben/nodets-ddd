import { interfaces, ContainerModule } from "inversify";

export abstract class Module {
  protected abstract bindModule(
    fn: (
      regis: interfaces.ContainerModuleCallBack,
    ) => interfaces.ContainerModuleCallBack,
  ): interfaces.ContainerModuleCallBack;

  getModule(): ContainerModule {
    return new ContainerModule(this.bindModule((regis) => regis));
  }
}

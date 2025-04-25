import { interfaces } from "inversify";
import { AllowAnonymousPath } from "./allowAnonymous-path.type";

export class AppOptions {
  routerPrefix: string = "/api";
  container?: interfaces.ContainerOptions = {
    autoBindInjectable: true,
  };
  allowAnonymousPath: AllowAnonymousPath[] = [];
  envPath: string = "";
}

import { interfaces } from "inversify";
import { AllowAnonymousPath } from "./types/allowAnonymous-path.type";

export class AppOptions {
  routerPrefix: string = "/api";
  controllerPath: string = "/controllers";
  container?: interfaces.ContainerOptions;
  allowAnonymousPath: AllowAnonymousPath[] = [];
}

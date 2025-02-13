import { interfaces } from "inversify";
import type { AllowAnonymousPath } from "./types/allowAnonymousPath";

export class AppOptions {
  routerPrefix: string = "/api";
  controllerPath: string = "/controllers";
  container?: interfaces.ContainerOptions;
  allowAnonymousPath: AllowAnonymousPath[] = [];
}

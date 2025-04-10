import { interfaces } from "inversify";
import { AllowAnonymousPath } from "./types/allowAnonymous-path.type";

export class AppOptions {
  routerPrefix: string = "/api";
  container?: interfaces.ContainerOptions;
  allowAnonymousPath: AllowAnonymousPath[] = [];
  envPath: string = "";
}

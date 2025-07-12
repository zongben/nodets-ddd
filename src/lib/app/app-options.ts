import { interfaces } from "inversify";

export type AllowAnonymousPath = {
  path: string;
  method: string;
};

export class AppOptions {
  routerPrefix: string = "/api";
  container?: interfaces.ContainerOptions = {
    autoBindInjectable: true,
  };
  allowAnonymousPath: AllowAnonymousPath[] = [];
}

import { App } from "../lib/bootstrap/app";
import { controllers } from "./controllers";
import { MediatorModule } from "../lib/mediator/mediator-module";
import { HandlerMap } from "./application/handler-map";
import { JwTokenModule } from "../lib/jwToken/jwtoken-module";
import { JwTokenSettings } from "../lib/jwToken/jwtoken-settings";
import { jwtValidHandler } from "../lib/controller/jwt-valid-handler";
import { exceptionMiddleware } from "../lib/middleware/exception-middleware";
import path from "node:path";
import { notFoundMiddleware } from "../lib/middleware/notfound-middleware";
import { AppDataSourceModule } from "../lib/typeORM/app-data-source-module";
import { AppDataSource } from "../lib/typeORM/app-data-source";
import { entities } from "./infra/db-entities/entities";

const app = App.createBuilder((opt) => {
  opt.allowAnonymousPath = [
    {
      path: "/auth/*",
      method: "^GET|POST$",
    },
  ];
  opt.envPath = path.join(__dirname, ".env");
});
app.loadModules(
  new MediatorModule(app.serviceContainer, HandlerMap, []),
  new JwTokenModule(
    new JwTokenSettings(app.env.get("JWT_SECRET"), {
      expiresIn: app.env.get("JWT_EXPIRES_IN"),
    }),
  ),
  new AppDataSourceModule(
    new AppDataSource({
      type: "sqlite",
      database: app.env.get("SQLITE_DB"),
      synchronize: app.env.get("NODE_ENV") === "dev" ? true : false,
      logging: false,
      entities: entities,
    }),
  ),
);
app.addHeaders({
  "Access-Control-Allow-Origin": app.env.get("CORS_ORIGIN"),
});
app.useJsonParser();
app.useJwtValidMiddleware(jwtValidHandler(app.env.get("JWT_SECRET")));
app.mapController(controllers);
app.useMiddleware(notFoundMiddleware);
app.useMiddleware(exceptionMiddleware);
app.run();

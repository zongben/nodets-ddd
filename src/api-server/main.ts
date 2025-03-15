import { App } from "../lib/bootstrap/app";
import { TypeORM } from "../lib/type-orm/type-orm";
import { controllers } from "./controllers";
import { db_entities } from "./infra/db-entities";
import { MediatorModule } from "../lib/mediator/mediator-module";
import { HandlerMap } from "./application/handler-map";
import { JwTokenModule } from "../lib/jwToken/jwtoken-module";
import { JwTokenSettings } from "../lib/jwToken/jwtoken-settings";
import { requestMiddleware } from "../lib/middleware/request-middleware";
import { jwtValidHandler } from "../lib/controller/jwt-valid-handler";
import { exceptionMiddleware } from "../lib/middleware/exception-middleware";
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const app = App.createBuilder((opt) => {
  opt.allowAnonymousPath = [
    {
      path: "/auth/*",
      method: "^GET|POST$",
    },
  ];
  opt.container = {
    autoBindInjectable: true,
  };
});
TypeORM.initDB({
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: true,
  logging: false,
  entities: db_entities,
});
app.registerModules(
  new MediatorModule(app.serviceContainer, HandlerMap, []),
  new JwTokenModule(
    new JwTokenSettings(app.env.JWT_SECRET, {
      expiresIn: app.env.JWT_EXPIRES_IN,
    }),
  ),
);
app.useJsonParser();
app.useMiddleware(requestMiddleware);
app.useJwtValidMiddleware(jwtValidHandler(app.env.JWT_SECRET));
app.mapController(controllers);
app.useMiddleware(exceptionMiddleware);
app.run();

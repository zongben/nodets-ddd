import { App } from "../lib/bootstrap/app";
import { controllers } from "./controllers";
import { MediatorModule } from "../lib/mediator/mediator-module";
import { HandlerMap } from "./application/handler-map";
import { JwTokenModule } from "../lib/jwToken/jwtoken-module";
import { JwTokenSettings } from "../lib/jwToken/jwtoken-settings";
import { requestMiddleware } from "../lib/middleware/request-middleware";
import { jwtValidHandler } from "../lib/controller/jwt-valid-handler";
import { exceptionMiddleware } from "../lib/middleware/exception-middleware";
import dotenv from "dotenv";
import { appDataSource } from "./infra/db-entities";
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
app.useExtension(() => {
  appDataSource
    .initialize()
    .then(() => console.log("Database initialized"))
    .catch((err) => console.error("Error to initialized", err));
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

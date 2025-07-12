import { App } from "../lib/bootstrap/app";
import { controllers } from "./controllers";
import { jwtValidHandler } from "../lib/controller/jwt-valid-handler";
import path from "node:path";
import { MediatorModule } from "../lib/mediator/mediator.module";
import { notFoundMiddleware } from "../lib/middleware/notfound.middleware";
import { exceptionMiddleware } from "../lib/middleware/exception.middleware";
import { JwTokenHelperModule } from "../lib/jwToken/jwtoken.module";
import { JWT_TYPES } from "./infra/jwtHelpers/types";
import { JwTokenSettings } from "../lib/jwToken/jwtoken-settings";
import { JwTokenHelper } from "../lib/jwToken/jwtoken-helper";
import { timerMiddleware } from "../lib/middleware/timer.middleware";
import { handlers } from "./application/handlers";
import { Logger, LOGGER_LEVEL } from "../lib/logger";

const app = App.createBuilder((opt) => {
  opt.allowAnonymousPath = [
    {
      path: "/auth/*",
      method: "^GET|POST$",
    },
  ];
});
app.useLogger(
  new Logger(
    app.env.get("NODE_ENV") === "dev" ? LOGGER_LEVEL.DEBUG : LOGGER_LEVEL.INFO,
  ),
);
app.useDotEnv(path.join(__dirname, ".env"));
app.loadModules(
  new MediatorModule(app.serviceContainer, handlers),
  new JwTokenHelperModule(
    JWT_TYPES.ACCESSTOKEN,
    new JwTokenHelper(
      new JwTokenSettings(app.env.get("JWT_SECRET"), {
        expiresIn: app.env.get("ACCESSTOKEN_EXPIRES_IN"),
      }),
    ),
  ),
  new JwTokenHelperModule(
    JWT_TYPES.REFRESHTOKEN,
    new JwTokenHelper(
      new JwTokenSettings(app.env.get("JWT_SECRET"), {
        expiresIn: app.env.get("REFRESHTOKEN_EXPIRES_IN"),
      }),
    ),
  ),
);
app.useCors({
  origin: app.env.get("CORS_ORIGIN"),
  methods: "GET,PUT,PATCH,POST,DELETE",
  credentials: true,
});
app.useJsonParser();
app.useUrlEncodedParser({ extended: true });
app.useJwtValidMiddleware(jwtValidHandler(app.env.get("JWT_SECRET")));
app.useMiddleware(timerMiddleware(app.logger));
app.mapController(controllers);
app.useMiddleware(notFoundMiddleware(app.logger));
app.useMiddleware(exceptionMiddleware(app.logger));
app.run(app.env.get("PORT"));

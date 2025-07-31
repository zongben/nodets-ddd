import { handlers } from "./application/handlers";
import { JwtModule } from "./infra/jwtHelpers/types";
import { controllers, wsController } from "./controllers";
import { App } from "@empackjs/core";
import {
  jwtGuard,
  Logger,
  LOGGER_LEVEL,
  timerMiddleware,
} from "@empackjs/utils";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, ".env") });

const app = App.createBuilder();
app.setDotEnv();
app.setLogger(
  new Logger(
    app.env.get("NODE_ENV") === "dev" ? LOGGER_LEVEL.DEBUG : LOGGER_LEVEL.INFO,
  ),
);
app.enableAuthGuard(jwtGuard(app.env.get("JWT_SECRET")));
app.setMediator(handlers);
app.loadModules(
  new JwtModule(
    {
      secret: app.env.get("JWT_SECRET"),
      options: {
        expiresIn: parseInt(app.env.get("ACCESSTOKEN_EXPIRES_IN")),
      },
    },
    {
      secret: app.env.get("JWT_SECRET"),
      options: {
        expiresIn: parseInt(app.env.get("REFRESHTOKEN_EXPIRES_IN")),
      },
    },
  ),
);
app.useCors({
  origin: app.env.get("CORS_ORIGIN"),
  methods: "GET,PUT,PATCH,POST,DELETE",
  credentials: true,
});
app.useJsonParser();
app.useUrlEncodedParser();
app.useMiddleware(timerMiddleware(app.logger));
app.mapController(controllers);
app.enableWebSocket(wsController);
app.run(parseInt(app.env.get("PORT")));

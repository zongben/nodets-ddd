import path from "path";
import { handlers } from "./application/handlers";
import { JwtModule } from "./infra/jwtHelpers/types";
import { controllers, wsController } from "./controllers";
import { App, jwtGuard, Logger, LOGGER_LEVEL } from "empack";

const app = App.createBuilder();
app.setDotEnv(path.join(__dirname, ".env"));
app.setLogger(
  new Logger(
    app.env.get("NODE_ENV") === "dev" ? LOGGER_LEVEL.DEBUG : LOGGER_LEVEL.INFO,
  ),
);
app.setAuthGuard(jwtGuard(app.env.get("JWT_SECRET")));
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
app.useUrlEncodedParser({ extended: true });
app.useTimerMiddleware();
app.mapController(controllers);
app.enableWebSocket(wsController);
app.run(parseInt(app.env.get("PORT")));

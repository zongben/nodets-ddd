import { App } from "../lib/bootstrap/app";
import { controllers } from "./controllers";
import { jwtValidHandler } from "../lib/controller/jwt-valid-handler";
import path from "node:path";
import { MediatorModule } from "../lib/mediator/mediator.module";
import { JwTokenSettingModule } from "../lib/jwToken/jwtoken.module";
import { notFoundMiddleware } from "../lib/middleware/notfound.middleware";
// import { Mongo } from "../lib/mongoDB/mongo";
// import { models } from "./infra/schemas";
// import { MongoModule } from "../lib/mongoDB/mongo.module";
import {
  AccesTokenSetting,
  RefreshTokenSetting,
} from "./infra/jwtoken-setting/jwtoken-setting";
import { JWT_TYPES } from "./infra/jwtoken-setting/types";
import { exceptionMiddleware } from "../lib/middleware/exception.middleware";
import { map } from "./application/handler.map";

const app = App.createBuilder((opt) => {
  opt.allowAnonymousPath = [
    {
      path: "/auth/*",
      method: "^GET|POST$",
    },
  ];
  opt.envPath = path.join(__dirname, ".env");
});

// const mongo = Mongo.create(app.env.get("MONGO_URL")).addModels(models);
// mongo.tryConnect(app.logger);
// mongo.trySyncIndexs(app.logger);

app.loadModules(
  new MediatorModule(app.serviceContainer, map),
  new JwTokenSettingModule(
    JWT_TYPES.ACCESSTOKEN,
    new AccesTokenSetting(app.env.get("JWT_SECRET"), {
      expiresIn: app.env.get("ACCESSTOKEN_EXPIRES_IN"),
    }),
  ),
  new JwTokenSettingModule(
    JWT_TYPES.REFRESHTOKEN,
    new RefreshTokenSetting(app.env.get("JWT_SECRET"), {
      expiresIn: app.env.get("REFRESHTOKEN_EXPIRES_IN"),
    }),
  ),
  // new MongoModule(mongo),
);
app.useCors({
  origin: app.env.get("CORS_ORIGIN"),
  methods: "GET,PUT,PATCH,POST,DELETE",
  credentials: true,
});
app.useJsonParser();
app.useJwtValidMiddleware(jwtValidHandler(app.env.get("JWT_SECRET")));
app.mapController(controllers);
app.useMiddleware(notFoundMiddleware);
app.useMiddleware(exceptionMiddleware(app.logger));
app.run();

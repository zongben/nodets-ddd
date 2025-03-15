import { DataSource } from "typeorm";
import { User } from "./user";

export const appDataSource = new DataSource({
  type: "sqlite",
  database: "./src/api-server/db.sqlite",
  synchronize: true,
  logging: false,
  entities: [User],
});

import { DataSource, DataSourceOptions } from "typeorm";

export class TypeORM {
  static initDB(options: DataSourceOptions) {
    const appDataSource = new DataSource(options);
    appDataSource
      .initialize()
      .then(() => console.log("Database initialized"))
      .catch((err) => console.error("Error to initialized", err));
    return appDataSource;
  }
}

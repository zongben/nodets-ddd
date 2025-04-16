import { DataSource, DataSourceOptions } from "typeorm";
import { IAppDataSource } from "./interfaces/app-data-source.interface";
import { injectable } from "inversify";

@injectable()
export class AppDataSource implements IAppDataSource {
  instance: DataSource;

  constructor(options: DataSourceOptions) {
    this.instance = new DataSource(options);

    this.instance
      .initialize()
      .then(() => {
        console.log("Data Source has been initialized");
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  }
}

import mongoose, { ClientSession } from "mongoose";
import { BaseSchema } from "./base-schema";
import { IMongo } from "./interfaces/mongo.interface";
import { logger } from "../logger/logger";

export class Mongo implements IMongo {
  private instance: mongoose.Connection;

  private constructor(url: string, options: mongoose.ConnectOptions) {
    this.instance = mongoose.createConnection(url, options);
  }

  static create(url: string, options: mongoose.ConnectOptions = {}) {
    return new Mongo(url, options);
  }

  async tryConnect() {
    try {
      await this.instance.asPromise();
      logger.info("MongoDB connected");
    } catch (error) {
      logger.warn(`MongoDB connection error: ${error}`);
    }
    return this;
  }

  async trySyncIndexs() {
    try {
      await this.instance.syncIndexes();
      logger.info("MongoDB indexes synced");
    } catch (error) {
      logger.warn(`MongoDB index sync error: ${error}`);
    }
    return this;
  }

  addModels(models: Array<new (...args: any[]) => BaseSchema>) {
    for (const model of models) {
      const instance = new model();
      const { name, schema } = instance.getSchema();
      this.instance.model(name, schema());
    }
    return this;
  }

  getModel<T>(name: string) {
    return this.instance.model<T>(name);
  }

  async startTransaction(
    fn: (session: ClientSession) => Promise<any>,
  ): Promise<any> {
    const session = await this.instance.startSession();
    session.startTransaction();
    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}

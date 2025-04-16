import mongoose from "mongoose";
import { BaseSchema } from "./base-schema";
import { IMongo } from "./interfaces/mongo.interface";

export class Mongo implements IMongo {
  private instance: mongoose.Connection;

  private constructor(url: string, options: mongoose.ConnectOptions) {
    this.instance = mongoose.createConnection(url, options);
  }

  static create(url: string, options: mongoose.ConnectOptions) {
    return new Mongo(url, options);
  }

  async connect() {
    try {
      await this.instance.asPromise();
      console.log("MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection error:", error);
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
}

import { Schema } from "mongoose";

export abstract class BaseSchema {
  abstract name: string;
  abstract schema: () => Schema;

  getSchema() {
    return {
      name: this.name,
      schema: this.schema,
    };
  }
}

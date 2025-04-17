import mongoose, { ClientSession } from "mongoose";

export interface IMongo {
  getModel<T>(name: string): mongoose.Model<T>;
  startTransaction(fn: (session: ClientSession) => Promise<any>): Promise<any>;
}

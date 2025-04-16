import mongoose from "mongoose";

export interface IMongo {
  getModel<T>(name: string): mongoose.Model<T>;
}

import { Schema } from "mongoose";
import { BaseSchema } from "../../../lib/mongoDB/base-schema";
import { COLLECTIONS } from "./collections.enum";

export interface IUser {
  id: string;
  account: string;
  password: string;
  username: string;
}

export class UserSchema extends BaseSchema {
  name = COLLECTIONS.USER;
  schema = () => {
    return new Schema<IUser>(
      {
        id: {
          type: String,
          required: true,
          unique: true,
        },
        account: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
      },
      {
        collection: COLLECTIONS.USER,
        timestamps: true,
      },
    );
  };
}

import mongoose, { Types, Document } from "mongoose";

const LibScheme = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
  },
  url: {
    unique: true,
    type: String,
    required: true,
  },
  emails: [
    {
      email: {
        type: String,
      },
      status: {
        type: Number,
        enum: [0, 1, 2],
        default: 0,
      },
    },
  ],
});

export enum EmailStatus {
  Wait = 0,
  Pending = 1,
  Approved = 2,
}

export interface EmailObject {
  _id?: string;
  email: string;
  status: EmailStatus;
}

export interface Lib extends Document {
  _id?: string;
  ownerId: string;
  url: string;
  emails: Types.Array<EmailObject>;
}

export default mongoose.model("lib", LibScheme);

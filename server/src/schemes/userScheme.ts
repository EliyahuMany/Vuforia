import mongoose, { Document } from "mongoose";

const UserScheme = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export interface User extends Document {
  _id?: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export default mongoose.model("user", UserScheme);

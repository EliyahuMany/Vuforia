import UserModel, { User } from "../../schemes/userScheme";
import { CallbackError, Document } from "mongoose";

export async function findByEmail(email: string): Promise<Document | string> {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ email }, (err: CallbackError, doc: Document) => {
      if (err) {
        reject("Something went wrong");
      }
      if (doc) resolve(doc);
      else reject("User not found");
    });
  });
}

export async function create(user: User): Promise<Document | string> {
  return new Promise((resolve, reject) => {
    UserModel.create(user, (err: CallbackError, doc: Document) => {
      if (err) {
        reject("Something went wrong");
      }
      resolve(doc);
    });
  });
}

export async function findById(id: string): Promise<User> {
  return new Promise((resolve, reject) => {
    UserModel.findById({ _id: id }, (err: CallbackError, doc: Document) => {
      if (err) {
        reject("User not found");
      }
      resolve(<User>doc);
    });
  });
}

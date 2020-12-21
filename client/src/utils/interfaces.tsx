export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
}

export interface IContext {
  user: IUser | undefined;
  signin: (user: IUser) => void;
  signout: () => void;
}

export enum IEmailStatus {
  Wait = 0,
  Pending = 1,
  Approved = 2,
}

export interface IEmailObject {
  _id?: string;
  email: string;
  status: IEmailStatus;
}

export interface ILib {
  _id?: string;
  ownerId: string;
  url: string;
  emails: Array<IEmailObject>;
}

import LibModel, { Lib, EmailStatus, EmailObject } from "../../schemes/libScheme";
import { CallbackError, Document, Types } from "mongoose";
import { sendEmail } from "../../utils/email";

export async function sendNextEmail(libId: string) {
  return new Promise((resolve, reject) => {
    LibModel.findOne({ _id: libId })
      .then((doc) => {
        if (doc) {
          let emails = (<Lib>doc).emails;

          for (let email of emails) {
            if (email.status == 0) {
              sendEmail((<Lib>doc).url, email.email, doc._id, <string>email._id);

              updateEmailStatus(<string>email._id, EmailStatus.Wait)
                .then((res) => {
                  if (typeof res !== "string") {
                    return resolve("succeeded");
                  } else {
                    reject("something went wrong!");
                  }
                })
                .catch((err) => console.log(err));

              break;
            }
          }
        }
      })
      .catch((err) => console.log(err));
  });
}

export async function updateEmailStatus(
  emailId: string,
  currStatus: EmailStatus.Wait | EmailStatus.Pending = EmailStatus.Wait
): Promise<Lib | string> {
  return new Promise((resolve, reject) => {
    LibModel.findOneAndUpdate(
      { "emails._id": emailId, "emails.status": currStatus },
      { "emails.$.status": currStatus + 1 },
      { upsert: true },
      (err: CallbackError, doc: Document) => {
        if (err) {
          reject("the library dosen't exists");
        }
        resolve(<Lib>doc);
      }
    );
  });
}

export async function findByUrl(url: string): Promise<Lib | string> {
  return new Promise((resolve, reject) => {
    LibModel.findOne({ url }, (err: CallbackError, doc: Document) => {
      if (err) {
        reject("the library dosen't exists");
      }

      resolve(<Lib>doc);
    });
  });
}

export async function findByOwnerId(id: string): Promise<Document | string> {
  return new Promise((resolve, reject) => {
    LibModel.find({ ownerId: id }, (err: CallbackError, doc: Document) => {
      if (err) {
        reject("the user dosen't create any upload request");
      }
      resolve(doc);
    });
  });
}

export async function create(lib: object): Promise<Lib> {
  return new Promise((resolve, reject) => {
    LibModel.create(lib, (err: CallbackError, doc: Document) => {
      if (err) {
        reject("Something went wrong");
      }
      resolve(<Lib>doc);
    });
  });
}

export function formatInputEmails(emails: Types.Array<string> | undefined) {
  if (emails) {
    return emails.map((email) => {
      return <EmailObject>{ email, status: EmailStatus.Wait };
    });
  }
}

export function formatOutputLib(lib: Lib) {
  return {
    url: lib.url,
    emails: lib.emails.map((emailObj: EmailObject) => {
      return { email: emailObj.email, status: emailObj.status };
    }),
  };
}

import mailer from "nodemailer";

const transporter = mailer.createTransport({
  pool: true,
  host: <string>process.env.EMAIL_HOST,
  port: +(<string>process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// verify connection configuration
export function verify() {
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
}

export function sendEmail(url: string, email: string, libId: string, emailId: string) {
  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your approval is required!",
    html: `<div><p>Press the link below to approve the request of ${url}</p><a href="${<string>(
      process.env.APPROVE_URL
    )}?libId=${libId}&emailId=${emailId}">Aprove now!</a></div>`,
  };

  transporter.sendMail(message, (err: Error | null, info: any) => {
    if (err) {
      console.log(err);
    }
  });
}

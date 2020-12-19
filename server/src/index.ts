import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { json, urlencoded } from "body-parser";
import userController from "./routes/user/controller";
import libController from "./routes/lib/controller";
import { verify } from "./utils/email";

const app = express();
app.use(cookieParser());
app.use(cors());
dotenv.config();
verify(); // verify email service work

const db = mongoose.connect(<string>process.env.MONGODB_URI, { useNewUrlParser: true });

const router: express.Router = express.Router();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/user", userController);
app.use("/lib", libController);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`The server listening on port ${process.env.SERVER_PORT}`);
});

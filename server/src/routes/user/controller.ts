import express, { Request, Response, NextFunction } from "express";
import { findByEmail, create, findById } from "./handler";
import { encrypt, decrypt } from "../../utils/crypto";
import { generateAccessToken, verifyAccessToken } from "../../utils/jwt";
import { User } from "../../schemes/userScheme";
const router = express.Router();

router.post("/create", findUser, createUser);
router.post("/auth", findUser, auth);
router.get("/isAuth", verifyAccessToken, isAuth);
router.get("/signout", verifyAccessToken, signout);

async function findUser(req: Request, res: Response, next: NextFunction) {
  if (req.body.user && req.body.user.email) {
    const user = await findByEmail(req.body.user.email).catch((err) => console.log(err));
    if (user) {
      req.body.userInfo = user;
    }
  } else {
    return res.status(204).end(); // No content
  }
  next();
}

async function signout(req: Request, res: Response, next: NextFunction) {
  if (req.body.userId) {
    const user = await findById(req.body.userId).catch((err) => console.log(err));
    if (user) {
      res.clearCookie("token");
      return res.status(200).send();
    }
  } else {
    return res.status(401).end();
  }
}

async function isAuth(req: Request, res: Response, next: NextFunction) {
  if (req.body.userId) {
    const user = await findById(req.body.userId).catch((err) => console.log(err));
    if (user) {
      return res.status(200).send(user);
    }
  } else {
    return res.status(401).end();
  }
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  const input = req.body.user;
  const userInfo = req.body.userInfo;

  if (userInfo) {
    res.status(409).send("email already exists"); // Conflict
  } else {
    const password = encrypt(input.password);
    const user = await create({ ...input, password }).catch((err) => console.log(err));
    if (user) {
      const userInfo = <User>user;
      req.body.userInfo = userInfo;
      res.status(201).send({ email: userInfo.email, firstname: userInfo.firstname, lastname: userInfo.lastname }); // Created
      next();
    }
  }
}

async function auth(req: Request, res: Response, next: NextFunction) {
  const input = req.body.user;
  const userInfo = req.body.userInfo;

  if (userInfo && input.email === userInfo.email && input.password && input.password === decrypt(userInfo.password)) {
    // user login information correct
    const token = generateAccessToken(userInfo.id);
    res.cookie("token", token, { maxAge: +(<string>process.env.TOKEN_EXPIRE), httpOnly: true }); // secure: true in production
    res.status(200).send({ email: userInfo.email, firstname: userInfo.firstname, lastname: userInfo.lastname });
  } else {
    // Unauthorized
    res.status(401).send("email or password are wrong");
  }
  next();
}

export default router;

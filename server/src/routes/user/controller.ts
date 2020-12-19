import express, { Request, Response, NextFunction } from "express";
import { findByEmail, create } from "./handler";
import { encrypt, decrypt } from "../../utils/crypto";
import { generateAccessToken } from "../../utils/jwt";
const router = express.Router();

router.post("/create", findUser, createUser);
router.post("/auth", findUser, auth);

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

async function createUser(req: Request, res: Response, next: NextFunction) {
  const input = req.body.user;
  const userInfo = req.body.userInfo;

  if (userInfo) {
    res.status(409).send("email already exists"); // Conflict
  } else {
    const password = encrypt(input.password);
    const user = await create({ ...input, password }).catch((err) => console.log(err));
    req.body.userInfo = user;
    res.status(201).send(); // Created
    next();
  }
}

async function auth(req: Request, res: Response, next: NextFunction) {
  const input = req.body.user;
  const userInfo = req.body.userInfo;

  if (userInfo && input.email === userInfo.email && input.password && input.password === decrypt(userInfo.password)) {
    // user login information correct
    const token = generateAccessToken(userInfo.id);
    res.cookie("token", token, { maxAge: +(<string>process.env.TOKEN_EXPIRE), httpOnly: true }); // secure: true in production
    res.status(200).send();
  } else {
    // Unauthorized
    res.status(401).send("email or password are wrong");
  }
  next();
}

export default router;

import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";
import { findById } from "../routes/user/handler";
import { User } from "../schemes/userScheme";

config();

export function generateAccessToken(id: string) {
  return jwt.sign({ id }, <string>process.env.AUTH_SECRET, { expiresIn: "30m" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, <string>process.env.AUTH_SECRET);
}

export async function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  // Cookies not exists
  if (!req.cookies.token) {
    return res.status(401).send();
  }

  const accessToken = req.cookies.token;

  if (!accessToken) {
    return res.status(403).send();
  }

  try {
    const decrypted = <any>verifyToken(accessToken);

    if (decrypted) {
      const info = await findById(<string>decrypted.id).catch((err) => console.log(err));
      if (info) {
        if (info._id == decrypted.id) {
          req.body.userId = decrypted.id;
          const token = generateAccessToken(decrypted.id);
          res.cookie("token", token, { maxAge: +(<string>process.env.TOKEN_EXPIRE), httpOnly: true }); // secure: true in production
          next();
        }
      }
    }
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).send();
  }
}

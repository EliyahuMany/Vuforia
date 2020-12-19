import express, { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/jwt";
import {
  findByUrl,
  create,
  formatInputEmails,
  formatOutputLib,
  findByOwnerId,
  updateEmailStatus,
  sendNextEmail,
} from "./handler";
import { Lib, EmailStatus } from "../../schemes/libScheme";
import { isArray, isString } from "util";
const router: express.Router = express.Router();

router.post("/create", verifyAccessToken, findLib, createLib, nextEmail);
router.get("/verify", verifyEmail, nextEmail);
router.get("/", verifyAccessToken, getLibs);

async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  if (req.query && req.query.libId && req.query.emailId) {
    return updateEmailStatus(<string>req.query.emailId, EmailStatus.Pending)
      .then((verified) => {
        if (!isString(verified)) {
          req.body.libId = req.query.libId;
          next();
          res.status(200).send("Approved");
        }
      })
      .catch((err) => res.status(406).send());
  } else {
    return res.status(400).send();
  }
}

async function nextEmail(req: Request, res: Response, next: NextFunction) {
  if (req.body.libId) {
    sendNextEmail(<string>req.body.libId).catch((res) => console.log(res));
    next();
  } else {
    return res.status(400).send();
  }
}

async function findLib(req: Request, res: Response, next: NextFunction) {
  if (req.body.lib && req.body.lib.url) {
    const url = req.body.lib.url;

    const lib = await findByUrl(url).catch((err) => console.log(err));

    if (lib) {
      req.body.libInfo = <Lib>lib;
    }
    next();
  } else {
    res.status(204).end(); // No content
  }
}

async function createLib(req: Request, res: Response, next: NextFunction) {
  if (req.body.libInfo) {
    return res.status(409).send("the library is already exists");
  }

  const lib = { ownerId: req.body.userId, url: req.body.lib.url, emails: formatInputEmails(req.body.lib.emails) };
  const libInfo: Lib | void = await create(lib).catch((err) => console.log(err));

  if (libInfo) {
    req.body.libId = libInfo._id;
    next();
    res.status(201).json(formatOutputLib(libInfo));
  } else {
    res.status(400).send("Cannot create lib request");
  }
}

async function getLibs(req: Request, res: Response, next: NextFunction) {
  if (req.body.userId) {
    const libs = await findByOwnerId(req.body.userId).catch((err) => console.log(err));
    if (isArray(libs)) {
      res.status(200).json(libs);
    }
  } else {
    res.status(401).send();
  }
  next();
}

export default router;

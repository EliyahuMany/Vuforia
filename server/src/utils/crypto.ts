import crypto from "crypto";
import { config } from "dotenv";

config();

const ALGORITHM = "aes-256-cbc";
const KEY = <string>process.env.SECRET;
const ENCODING = "utf8";

export function encrypt(value: string): string {
  const cipher = crypto.createCipher(ALGORITHM, KEY);
  return cipher.update(value, ENCODING, "hex") + cipher.final("hex");
}

export function decrypt(value: string): string | undefined {
  const decipher = crypto.createDecipher(ALGORITHM, KEY);
  try {
    const decrypted = decipher.update(value, "hex", ENCODING) + decipher.final(ENCODING);
    if (decrypted) {
      return decrypted;
    }
  } catch (err) {
    console.log(err);
  }
}

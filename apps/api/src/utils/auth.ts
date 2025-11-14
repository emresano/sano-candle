import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { ENV } from "../env";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, ENV.bcryptSaltRounds);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}


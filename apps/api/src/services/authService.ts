import { eq, or } from "drizzle-orm";
import { db } from "../db";
import { users, sessions } from "../../../../drizzle/schema";
import { hashPassword, verifyPassword, generateSessionToken, hashToken } from "../utils/auth";
import { ENV } from "../env";

export async function getUserByUsernameOrEmail(identifier: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.username, identifier), eq(users.email, identifier)))
    .limit(1);
  return user ?? null;
}

export async function createUser(params: {
  username: string;
  email: string;
  password: string;
  role?: "customer" | "admin";
  fullName?: string;
}) {
  const passwordHash = await hashPassword(params.password);
  const [result] = await db
    .insert(users)
    .values({
      username: params.username,
      email: params.email,
      passwordHash,
      role: params.role ?? "customer",
      fullName: params.fullName,
    });

  return Number(result.insertId);
}

export async function createSessionForUser(userId: number, meta: { userAgent?: string; ipAddress?: string }) {
  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + ENV.sessionTtlMs);

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
    userAgent: meta.userAgent,
    ipAddress: meta.ipAddress,
  });

  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, userId));

  return { token, expiresAt };
}

export async function revokeSession(token: string) {
  const hashed = hashToken(token);
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.tokenHash, hashed));
}

export async function authenticateUser(identifier: string, password: string) {
  const user = await getUserByUsernameOrEmail(identifier);
  if (!user) {
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return null;
  }

  return user;
}


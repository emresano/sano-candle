import { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/http";
import { ENV } from "../env";
import { hashToken } from "../utils/auth";
import { db } from "../db";
import { sessions, users } from "../../../../drizzle/schema";
import { eq, and, isNull, gt } from "drizzle-orm";
import { AuthenticatedRequest } from "../types";

type RequestWithSession = Request & { cookies?: Record<string, string>; user?: any; sessionToken?: string };

async function getSession(req: RequestWithSession) {
  const token = req.cookies?.[ENV.sessionCookieName];
  if (!token) return null;

  const hashed = hashToken(token);
  const now = new Date();

  const session = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.tokenHash, hashed),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, now)
      )
    )
    .limit(1);

  if (session.length === 0) return null;

  const result = {
    token,
    session: session[0].session,
    user: session[0].user,
  };

  return result;
}

export async function attachUser(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getSession(req as RequestWithSession);
    if (data) {
      const authReq = req as AuthenticatedRequest;
      authReq.user = data.user;
      authReq.sessionToken = data.token;
    }
    next();
  } catch (error) {
    next(error);
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const data = await getSession(req as RequestWithSession);
  if (!data) {
    return sendError(res, "Authentication required", 401);
  }

  const authReq = req as AuthenticatedRequest;
  authReq.user = data.user;
  authReq.sessionToken = data.token;
  return next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const data = await getSession(req as RequestWithSession);
  if (!data) {
    return sendError(res, "Authentication required", 401);
  }

  if (data.user.role !== "admin") {
    return sendError(res, "Admin privileges required", 403);
  }

  const authReq = req as AuthenticatedRequest;
  authReq.user = data.user;
  authReq.sessionToken = data.token;
  return next();
}


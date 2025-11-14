import { Router } from "express";
import { z } from "zod";
import { asyncHandler, sendError, sendSuccess } from "../utils/http";
import { authenticateUser, createSessionForUser, revokeSession } from "../services/authService";
import { ENV, isProduction } from "../env";
import { requireAuth } from "../middleware/auth";

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1, "Kullanıcı adı gereklidir"),
  password: z.string().min(1, "Şifre gereklidir"),
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }

    const user = await authenticateUser(parsed.data.username, parsed.data.password);
    if (!user) {
      return sendError(res, "Kullanıcı adı veya şifre hatalı", 401);
    }

    const { token, expiresAt } = await createSessionForUser(user.id, {
      userAgent: req.get("user-agent") ?? undefined,
      ipAddress: req.ip,
    });

    res.cookie(ENV.sessionCookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return sendSuccess(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });
  })
);

router.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (req.sessionToken) {
      await revokeSession(req.sessionToken);
      res.clearCookie(ENV.sessionCookieName, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
      });
    }
    return sendSuccess(res, { success: true });
  })
);

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    if (!req.user) {
      return sendSuccess(res, null);
    }

    return sendSuccess(res, {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      fullName: req.user.fullName,
    });
  })
);

export default router;


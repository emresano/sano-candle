import { Router } from "express";
import { z } from "zod";
import { asyncHandler, sendError, sendSuccess } from "../utils/http";
import { getSiteSettings, upsertSiteSettings } from "../services/siteSettingsService";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const settings = await getSiteSettings();
    return sendSuccess(res, settings);
  })
);

const settingsSchema = z.object({
  contactEmail: z.string().email({ message: "Geçerli bir e-posta girin" }).optional(),
  instagramUrl: z
    .string()
    .url({ message: "Geçerli bir URL girin" })
    .or(z.literal(""))
    .optional()
    .transform((value) => (value === "" ? null : value)),
  facebookUrl: z
    .string()
    .url({ message: "Geçerli bir URL girin" })
    .or(z.literal(""))
    .optional()
    .transform((value) => (value === "" ? null : value)),
  notificationEmail: z.string().email({ message: "Geçerli bir e-posta girin" }).optional(),
});

router.put(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = settingsSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }

    const settings = await upsertSiteSettings(parsed.data);
    return sendSuccess(res, settings);
  })
);

export default router;

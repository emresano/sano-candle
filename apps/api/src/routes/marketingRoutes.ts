import { Router } from "express";
import { z } from "zod";
import { asyncHandler, sendError, sendSuccess } from "../utils/http";
import { subscribeNewsletter, removeNewsletterSubscriber, saveContactMessage } from "../services/communicationService";

const router = Router();

const subscribeSchema = z.object({
  email: z.string().email(),
});

router.post(
  "/newsletter/subscribe",
  asyncHandler(async (req, res) => {
    const parsed = subscribeSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }
    const created = await subscribeNewsletter(parsed.data.email);
    return sendSuccess(res, { created });
  })
);

router.delete(
  "/newsletter/unsubscribe",
  asyncHandler(async (req, res) => {
    const parsed = subscribeSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }
    await removeNewsletterSubscriber(parsed.data.email);
    return sendSuccess(res, { removed: true });
  })
);

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

router.post(
  "/contact",
  asyncHandler(async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }
    await saveContactMessage(parsed.data);
    return sendSuccess(res, { success: true }, 201);
  })
);

export default router;


import { Router } from "express";
import { z } from "zod";
import { asyncHandler, sendError, sendSuccess } from "../utils/http";
import {
  CheckoutSessionInput,
  createCheckoutSession,
  finalizeCheckout,
  getCheckoutSessionStatus,
} from "../services/checkoutService";

const router = Router();

const phonePattern = /^5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;

const sessionSchema = z.object({
  customerName: z.string().min(3),
  customerEmail: z.string().email(),
  customerPhone: z.string().regex(phonePattern, { message: "Telefon numarası 5xx xxx xx xx formatında olmalıdır" }),
  shippingAddress: z.string().min(10),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

router.post(
  "/session",
  asyncHandler(async (req, res) => {
    const parsed = sessionSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }

    const payload: CheckoutSessionInput = {
      ...parsed.data,
      customerPhone: parsed.data.customerPhone,
      ipAddress: req.ip,
    };

    const result = await createCheckoutSession(payload);
    return sendSuccess(res, result, 201);
  })
);

router.get(
  "/session/:token",
  asyncHandler(async (req, res) => {
    const { token } = req.params;
    const status = await getCheckoutSessionStatus(token);
    return sendSuccess(res, status);
  })
);

router.post(
  "/iyzico/callback",
  asyncHandler(async (req, res) => {
    const token = req.body?.token ?? req.body?.iyziToken;
    if (!token || typeof token !== "string") {
      return sendError(res, "Geçersiz token", 400);
    }

    let status: { status: "success" | "failed"; orderNumber?: string; message?: string };
    try {
      status = await finalizeCheckout(token);
    } catch (error) {
      console.error("Checkout finalize error", error);
      status = { status: "failed", message: error instanceof Error ? error.message : "Bilinmeyen hata" };
    }

    const responseHtml = `<!DOCTYPE html>
<html lang="tr">
  <body>
    <script>
      window.parent.postMessage({ type: "iyzico:result", status: "${status.status}", token: "${token}", orderNumber: "${status.orderNumber ?? ""}", message: "${status.message ?? ""}" }, "*");
    </script>
  </body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(responseHtml);
  })
);

export default router;

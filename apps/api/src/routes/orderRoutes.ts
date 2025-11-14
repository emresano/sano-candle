import { Router } from "express";
import { z } from "zod";
import { asyncHandler, sendError, sendSuccess } from "../utils/http";
import { requireAdmin, requireAuth } from "../middleware/auth";
import {
  listOrders,
  getOrderById,
  getOrderByNumber,
  getOrderItems,
  updateOrderStatus,
  createOrder,
} from "../services/orderService";
import { clearCart } from "../services/cartService";

const router = Router();

router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const orders = await listOrders();
    return sendSuccess(res, orders);
  })
);

router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await getOrderById(Number(req.params.id));
    if (!order) {
      return sendError(res, "Sipariş bulunamadı", 404);
    }
    if (req.user.role !== "admin" && order.userId !== req.user.id) {
      return sendError(res, "Bu siparişe erişim izniniz yok", 403);
    }
    return sendSuccess(res, order);
  })
);

router.get(
  "/order-number/:orderNumber",
  asyncHandler(async (req, res) => {
    const order = await getOrderByNumber(req.params.orderNumber);
    if (!order) {
      return sendError(res, "Sipariş bulunamadı", 404);
    }
    return sendSuccess(res, order);
  })
);

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(1),
  paymentMethod: z.string().optional(),
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
  "/",
  asyncHandler(async (req, res) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }

    const order = await createOrder({
      userId: req.user?.id,
      ...parsed.data,
    });

    if (req.user?.id) {
      await clearCart(req.user.id);
    }

    return sendSuccess(res, order, 201);
  })
);

const statusSchema = z.object({
  status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]),
});

router.patch(
  "/:id/status",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }
    await updateOrderStatus(Number(req.params.id), parsed.data.status);
    return sendSuccess(res, { id: Number(req.params.id), status: parsed.data.status });
  })
);

router.get(
  "/:id/items",
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await getOrderById(Number(req.params.id));
    if (!order) {
      return sendError(res, "Sipariş bulunamadı", 404);
    }
    if (req.user.role !== "admin" && order.userId !== req.user.id) {
      return sendError(res, "Bu siparişe erişim izniniz yok", 403);
    }
    const items = await getOrderItems(order.id);
    return sendSuccess(res, items);
  })
);

export default router;


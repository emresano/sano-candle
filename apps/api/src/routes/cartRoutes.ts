import { Router } from "express";
import { z } from "zod";
import { asyncHandler, sendError, sendSuccess } from "../utils/http";
import { requireAuth } from "../middleware/auth";
import { getCartItems, addToCart, updateCartItem, removeCartItem, clearCart } from "../services/cartService";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const items = await getCartItems(req.user.id);
    return sendSuccess(res, items);
  })
);

const addSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().default(1),
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = addSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }
    const id = await addToCart(req.user.id, parsed.data.productId, parsed.data.quantity);
    const items = await getCartItems(req.user.id);
    return sendSuccess(res, { id, items }, 201);
  })
);

const updateSchema = z.object({
  quantity: z.number().int().positive(),
});

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }
    await updateCartItem(Number(req.params.id), parsed.data.quantity);
    const items = await getCartItems(req.user.id);
    return sendSuccess(res, items);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await removeCartItem(Number(req.params.id));
    const items = await getCartItems(req.user.id);
    return sendSuccess(res, items);
  })
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    await clearCart(req.user.id);
    return sendSuccess(res, []);
  })
);

export default router;


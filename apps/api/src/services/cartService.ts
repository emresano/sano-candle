import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { cartItems, products } from "../../../../drizzle/schema";

export async function getCartItems(userId: number) {
  return db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      product: products,
    })
    .from(cartItems)
    .innerJoin(products, eq(products.id, cartItems.productId))
    .where(eq(cartItems.userId, userId));
}

export async function addToCart(userId: number, productId: number, quantity: number) {
  const [existing] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
    .limit(1);

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id));
    return existing.id;
  }

  const [insert] = await db.insert(cartItems).values({ userId, productId, quantity });
  return Number(insert.insertId);
}

export async function updateCartItem(id: number, quantity: number) {
  await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
}

export async function removeCartItem(id: number) {
  await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(userId: number) {
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}


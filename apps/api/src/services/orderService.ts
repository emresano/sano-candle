import crypto from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { orders, orderItems, products } from "../../../../drizzle/schema";

type CreateOrderItemInput = {
  productId: number;
  quantity: number;
};

export type CreateOrderInput = {
  userId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  paymentMethod?: string;
  notes?: string;
  paymentReference?: string;
  status?: (typeof orders.$inferSelect.status);
  items: CreateOrderItemInput[];
};

function generateOrderNumber() {
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `ORD-${Date.now()}-${random}`;
}

export async function listOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return order ?? null;
}

export async function getOrderByNumber(orderNumber: string) {
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return order ?? null;
}

export async function getOrderItems(orderId: number) {
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function updateOrderStatus(id: number, status: typeof orders.$inferSelect.status) {
  await db.update(orders).set({ status }).where(eq(orders.id, id));
}

export async function createOrder(payload: CreateOrderInput) {
  return db.transaction(async (tx) => {
    let totalAmount = 0;

    const detailedItems = [] as {
      productId: number | null;
      productName: string;
      productSlug: string | null;
      unitPrice: number;
      quantity: number;
    }[];

    for (const item of payload.items) {
      const [product] = await tx
        .select({
          id: products.id,
          nameTr: products.nameTr,
          nameEn: products.nameEn,
          price: products.price,
          slug: products.slug,
        })
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (!product) {
        continue;
      }

      totalAmount += product.price * item.quantity;
      detailedItems.push({
        productId: product.id,
        productName: product.nameTr,
        productSlug: product.slug,
        unitPrice: product.price,
        quantity: item.quantity,
      });
    }

    if (detailedItems.length === 0) {
      throw new Error("No valid order items found");
    }

    const orderNumber = generateOrderNumber();

    const [orderResult] = await tx.insert(orders).values({
      userId: payload.userId,
      orderNumber,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      shippingAddress: payload.shippingAddress,
      totalAmount,
      paymentMethod: payload.paymentMethod,
      paymentReference: payload.paymentReference,
      notes: payload.notes,
      status: payload.status ?? "pending",
    });

    const orderId = Number(orderResult.insertId);

    await tx.insert(orderItems).values(
      detailedItems.map((item) => ({
        orderId,
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug ?? null,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      }))
    );

    return {
      orderId,
      orderNumber,
      totalAmount,
    };
  });
}


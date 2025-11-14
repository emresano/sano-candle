import crypto from "node:crypto";
import Iyzipay from "iyzipay";
import { eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { checkoutSessions, products, orders } from "../../../../drizzle/schema";
import { ENV, iyzicoEnabled } from "../env";
import { sendOrderNotification } from "./emailService";
import { createOrder } from "./orderService";
import type { CreateOrderInput } from "./orderService";
import type { CheckoutSession } from "../../../../drizzle/schema";

const iyzipayClient = iyzicoEnabled
  ? new Iyzipay({
      apiKey: ENV.iyzico.apiKey!,
      secretKey: ENV.iyzico.secretKey!,
      uri: ENV.iyzico.baseUrl!,
    })
  : null;

export type CheckoutItemInput = {
  productId: number;
  quantity: number;
};

export type CheckoutSessionInput = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  notes?: string;
  items: CheckoutItemInput[];
  ipAddress?: string;
};

type StoredCheckoutItem = {
  productId: number;
  quantity: number;
  unitPrice: number;
  productName: string;
  productSlug: string;
};

function formatPrice(amount: number) {
  return (amount / 100).toFixed(2);
}

function normalizePhone(phone?: string) {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) {
    return `+${digits}`;
  }
  if (digits.startsWith("0")) {
    return `+9${digits}`;
  }
  if (digits.startsWith("5")) {
    return `+90${digits}`;
  }
  return `+${digits}`;
}

async function fetchProductDetails(items: CheckoutItemInput[]) {
  const productIds = items.map((item) => item.productId);
  const records = await db
    .select({
      id: products.id,
      price: products.price,
      nameTr: products.nameTr,
      nameEn: products.nameEn,
      slug: products.slug,
    })
    .from(products)
    .where(inArray(products.id, productIds));

  const map = new Map(records.map((record) => [record.id, record]));
  const detailed: StoredCheckoutItem[] = [];
  for (const item of items) {
    const record = map.get(item.productId);
    if (!record) {
      throw new Error(`Product ${item.productId} not found`);
    }
    detailed.push({
      productId: record.id,
      quantity: item.quantity,
      unitPrice: record.price,
      productName: record.nameTr,
      productSlug: record.slug,
    });
  }
  return detailed;
}

export async function createCheckoutSession(input: CheckoutSessionInput) {
  if (!iyzipayClient || !iyzicoEnabled) {
    throw new Error("Iyzico ödeme ayarları tanımlı değil");
  }

  const sessionItems = await fetchProductDetails(input.items);
  const totalAmount = sessionItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  if (totalAmount <= 0) {
    throw new Error("Toplam tutar geçersiz");
  }

  const conversationId = crypto.randomUUID();
  const request: Iyzipay.CheckoutFormInitializeRequest = {
    locale: "tr",
    conversationId,
    price: formatPrice(totalAmount),
    paidPrice: formatPrice(totalAmount),
    currency: Iyzipay.CURRENCY.TRY,
    basketId: conversationId,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: `${ENV.appUrl}/api/checkout/iyzico/callback`,
    buyer: {
      id: crypto.randomUUID(),
      name: input.customerName.split(" ")[0] ?? input.customerName,
      surname: input.customerName.split(" ").slice(1).join(" ") || input.customerName,
      email: input.customerEmail,
      gsmNumber: normalizePhone(input.customerPhone) ?? "+905000000000",
      identityNumber: "11111111111",
      registrationAddress: input.shippingAddress,
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34000",
      ip: input.ipAddress ?? "127.0.0.1",
    },
    shippingAddress: {
      contactName: input.customerName,
      city: "Istanbul",
      country: "Turkey",
      address: input.shippingAddress,
      zipCode: "34000",
    },
    billingAddress: {
      contactName: input.customerName,
      city: "Istanbul",
      country: "Turkey",
      address: input.shippingAddress,
      zipCode: "34000",
    },
    basketItems: sessionItems.map((item, index) => ({
      id: String(item.productId),
      name: item.productName,
      category1: "Candle",
      category2: "Home",
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: formatPrice(item.unitPrice * item.quantity),
    })),
  };

  const initializeResult: Iyzipay.CheckoutFormInitializeResult = await new Promise((resolve, reject) => {
    iyzipayClient.checkoutFormInitialize.create(request, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  if (initializeResult.status !== "success" || !initializeResult.token || !initializeResult.checkoutFormContent) {
    throw new Error(initializeResult.errorMessage ?? "Ödeme başlatılırken bir hata oluştu");
  }

  await db.insert(checkoutSessions).values({
    token: initializeResult.token,
    conversationId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: normalizePhone(input.customerPhone) ?? null,
    shippingAddress: input.shippingAddress,
    notes: input.notes ?? null,
    itemsJson: JSON.stringify(sessionItems),
    totalAmount,
    status: "pending",
  });

  return {
    token: initializeResult.token,
    checkoutFormContent: initializeResult.checkoutFormContent,
  };
}

function parseStoredItems(itemsJson: string): StoredCheckoutItem[] {
  try {
    const parsed = JSON.parse(itemsJson) as StoredCheckoutItem[];
    return parsed;
  } catch (error) {
    console.error("Failed to parse checkout session items", error);
    throw new Error("Sipariş detayları okunamadı");
  }
}

async function markSessionStatus(token: string, status: CheckoutSession["status"], orderId?: number) {
  await db
    .update(checkoutSessions)
    .set({ status, orderId: orderId ?? null })
    .where(eq(checkoutSessions.token, token));
}

export async function finalizeCheckout(token: string) {
  if (!iyzipayClient || !iyzicoEnabled) {
    throw new Error("Iyzico ödeme ayarları tanımlı değil");
  }

  const [session] = await db
    .select()
    .from(checkoutSessions)
    .where(eq(checkoutSessions.token, token))
    .limit(1);

  if (!session) {
    throw new Error("Ödeme oturumu bulunamadı");
  }

  if (session.status === "paid") {
    return { status: "success" as const, orderNumber: await lookupOrderNumber(session.orderId) };
  }
  if (session.status === "failed") {
    return { status: "failed" as const };
  }

  const retrieveResult: Iyzipay.CheckoutFormResult = await new Promise((resolve, reject) => {
    iyzipayClient.checkoutForm.retrieve(
      {
        locale: "tr",
        conversationId: session.conversationId ?? "",
        token,
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });

  if (retrieveResult.paymentStatus === "SUCCESS") {
    const items = parseStoredItems(session.itemsJson).map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const orderPayload: CreateOrderInput = {
      customerName: session.customerName,
      customerEmail: session.customerEmail,
      customerPhone: session.customerPhone ?? undefined,
      shippingAddress: session.shippingAddress,
      notes: session.notes ?? undefined,
      paymentMethod: "iyzico",
      paymentReference: token,
      status: "paid",
      items,
    };

    const order = await createOrder(orderPayload);
    await markSessionStatus(token, "paid", order.orderId);

    await sendOrderNotification({
      status: "success",
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      customerName: session.customerName,
      customerEmail: session.customerEmail,
    });

    return { status: "success" as const, orderNumber: order.orderNumber };
  }

  await markSessionStatus(token, "failed");
  await sendOrderNotification({
    status: "failed",
    totalAmount: session.totalAmount,
    customerName: session.customerName,
    customerEmail: session.customerEmail,
    errorMessage: retrieveResult.errorMessage,
  });

  return { status: "failed" as const, message: retrieveResult.errorMessage };
}

async function lookupOrderNumber(orderId?: number | null) {
  if (!orderId) return undefined;
  const [order] = await db
    .select({ orderNumber: orders.orderNumber })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  return order?.orderNumber;
}

export async function getCheckoutSessionStatus(token: string) {
  const [session] = await db
    .select({
      status: checkoutSessions.status,
      orderId: checkoutSessions.orderId,
      totalAmount: checkoutSessions.totalAmount,
      orderNumber: orders.orderNumber,
    })
    .from(checkoutSessions)
    .leftJoin(orders, eq(orders.id, checkoutSessions.orderId))
    .where(eq(checkoutSessions.token, token))
    .limit(1);

  if (!session) {
    throw new Error("Oturum bulunamadı");
  }

  return {
    status: session.status,
    orderId: session.orderId,
    orderNumber: session.orderNumber,
  };
}

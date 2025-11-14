import { db } from "../db";
import { newsletterSubscribers, contactMessages } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function subscribeNewsletter(email: string) {
  try {
    await db.insert(newsletterSubscribers).values({ email });
    return true;
  } catch (error) {
    const duplicateCodes = ["ER_DUP_ENTRY", "23505"];
    if (typeof error === "object" && error && "code" in error && duplicateCodes.includes(String((error as any).code))) {
      return false;
    }
    throw error;
  }
}

export async function removeNewsletterSubscriber(email: string) {
  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
}

export async function saveContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  await db.insert(contactMessages).values(data);
}


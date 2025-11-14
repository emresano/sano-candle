import { db } from "../db";
import {
  collections,
  products,
  productImages,
} from "../../../../drizzle/schema";
import { eq, and, desc, asc, SQL } from "drizzle-orm";

export async function getCollections() {
  return db.select().from(collections).orderBy(asc(collections.displayOrder));
}

export async function getCollectionBySlug(slug: string) {
  const [collection] = await db
    .select()
    .from(collections)
    .where(eq(collections.slug, slug))
    .limit(1);
  return collection ?? null;
}

export async function createCollection(data: typeof collections.$inferInsert) {
  const [result] = await db.insert(collections).values(data);
  return Number(result.insertId);
}

export async function updateCollection(id: number, data: Partial<typeof collections.$inferInsert>) {
  await db.update(collections).set(data).where(eq(collections.id, id));
}

export async function deleteCollection(id: number) {
  await db.delete(collections).where(eq(collections.id, id));
}

export async function getProducts(options?: {
  collectionId?: number;
  collectionSlug?: string;
  featured?: boolean;
}) {
  if (options?.collectionSlug) {
    const collection = await getCollectionBySlug(options.collectionSlug);
    if (!collection) return [];
    options.collectionId = collection.id;
  }

  const conditions: SQL[] = [];
  if (options?.collectionId) {
    conditions.push(eq(products.collectionId, options.collectionId));
  }
  if (options?.featured) {
    conditions.push(eq(products.featured, 1));
  }

  let query = db.select().from(products);
  if (conditions.length === 1) {
    query = query.where(conditions[0]);
  } else if (conditions.length > 1) {
    query = query.where(and(...conditions));
  }
  return query.orderBy(desc(products.createdAt));
}

export async function getFeaturedProducts(limit = 4) {
  return db
    .select()
    .from(products)
    .where(eq(products.featured, 1))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}

export async function getProductBySlug(slug: string) {
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return product ?? null;
}

export async function getProductById(id: number) {
  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return product ?? null;
}

export async function createProduct(data: typeof products.$inferInsert) {
  const [result] = await db.insert(products).values(data);
  return Number(result.insertId);
}

export async function updateProduct(id: number, data: Partial<typeof products.$inferInsert>) {
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id));
}

export async function replaceProductImages(productId: number, images: { imageUrl: string; altText?: string; displayOrder?: number }[]) {
  await db.delete(productImages).where(eq(productImages.productId, productId));
  if (!images.length) return;
  await db.insert(productImages).values(
    images.map((image, index) => ({
      productId,
      imageUrl: image.imageUrl,
      altText: image.altText,
      displayOrder: image.displayOrder ?? index,
    }))
  );
}

export async function getProductImages(productId: number) {
  return db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.displayOrder));
}


import { Router } from "express";
import { z } from "zod";
import { asyncHandler, sendError, sendSuccess } from "../utils/http";
import {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
  getProducts,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  replaceProductImages,
  getProductImages,
} from "../services/catalogService";
import { requireAdmin } from "../middleware/auth";

const router = Router();

const collectionSchema = z.object({
  slug: z.string().min(1),
  nameTr: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionTr: z.string().optional(),
  descriptionEn: z.string().optional(),
  imageUrl: z.string().url().optional(),
  displayOrder: z.number().int().nonnegative().default(0),
});

router.get(
  "/collections",
  asyncHandler(async (_req, res) => {
    const data = await getCollections();
    return sendSuccess(res, data);
  })
);

router.get(
  "/collections/:slug",
  asyncHandler(async (req, res) => {
    const collection = await getCollectionBySlug(req.params.slug);
    if (!collection) {
      return sendError(res, "Koleksiyon bulunamadı", 404);
    }
    return sendSuccess(res, collection);
  })
);

router.post(
  "/collections",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = collectionSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }
    const id = await createCollection(parsed.data);
    return sendSuccess(res, { id }, 201);
  })
);

router.put(
  "/collections/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = collectionSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }
    await updateCollection(Number(req.params.id), parsed.data);
    return sendSuccess(res, { id: Number(req.params.id) });
  })
);

router.delete(
  "/collections/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await deleteCollection(Number(req.params.id));
    return sendSuccess(res, { id: Number(req.params.id) });
  })
);

const productSchema = z.object({
  collectionId: z.number().int().optional(),
  slug: z.string().min(1),
  nameTr: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionTr: z.string().optional(),
  descriptionEn: z.string().optional(),
  compositionTr: z.string().optional(),
  compositionEn: z.string().optional(),
  storyTr: z.string().optional(),
  storyEn: z.string().optional(),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative().default(0),
  imageUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
  images: z
    .array(
      z.object({
        imageUrl: z.string().url(),
        altText: z.string().optional(),
        displayOrder: z.number().int().nonnegative().optional(),
      })
    )
    .optional(),
});

router.get(
  "/products",
  asyncHandler(async (req, res) => {
    const featured = req.query.featured === "true";
    const collectionId = req.query.collectionId ? Number(req.query.collectionId) : undefined;
    const collectionSlug = typeof req.query.collectionSlug === "string" ? req.query.collectionSlug : undefined;
    const data = await getProducts({ featured, collectionId, collectionSlug });
    return sendSuccess(res, data);
  })
);

router.get(
  "/products/featured",
  asyncHandler(async (_req, res) => {
    const data = await getFeaturedProducts();
    return sendSuccess(res, data);
  })
);

router.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await getProductById(Number(req.params.id));
    if (!product) {
      return sendError(res, "Ürün bulunamadı", 404);
    }
    const images = await getProductImages(product.id);
    return sendSuccess(res, { ...product, images });
  })
);

router.get(
  "/products/slug/:slug",
  asyncHandler(async (req, res) => {
    const product = await getProductBySlug(req.params.slug);
    if (!product) {
      return sendError(res, "Ürün bulunamadı", 404);
    }
    const images = await getProductImages(product.id);
    return sendSuccess(res, { ...product, images });
  })
);

router.post(
  "/products",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }

    const { images, featured, ...productData } = parsed.data;
    const id = await createProduct({
      ...productData,
      featured: featured ? 1 : 0,
    });
    if (images?.length) {
      await replaceProductImages(id, images);
    }
    const product = await getProductById(id);
    const productImagesData = await getProductImages(id);
    return sendSuccess(res, { ...product, images: productImagesData }, 201);
  })
);

router.put(
  "/products/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = productSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, parsed.error.issues[0]?.message ?? "Geçersiz veri", 400);
    }
    const { images, featured, ...productData } = parsed.data;
    await updateProduct(Number(req.params.id), {
      ...productData,
      ...(featured !== undefined ? { featured: featured ? 1 : 0 } : {}),
    });
    if (images) {
      await replaceProductImages(Number(req.params.id), images);
    }
    const product = await getProductById(Number(req.params.id));
    const productImagesData = await getProductImages(Number(req.params.id));
    return sendSuccess(res, { ...product, images: productImagesData });
  })
);

router.delete(
  "/products/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await deleteProduct(Number(req.params.id));
    return sendSuccess(res, { id: Number(req.params.id) });
  })
);

export default router;


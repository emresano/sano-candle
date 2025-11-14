import { collections, products } from "../../../../drizzle/schema";
export declare function getCollections(): Promise<{}[]>;
export declare function getCollectionBySlug(slug: string): Promise<{}>;
export declare function createCollection(data: typeof collections.$inferInsert): Promise<number>;
export declare function updateCollection(id: number, data: Partial<typeof collections.$inferInsert>): Promise<void>;
export declare function deleteCollection(id: number): Promise<void>;
export declare function getProducts(options?: {
    collectionId?: number;
    collectionSlug?: string;
    featured?: boolean;
}): Promise<{}[]>;
export declare function getFeaturedProducts(limit?: number): Promise<{}[]>;
export declare function getProductBySlug(slug: string): Promise<{}>;
export declare function getProductById(id: number): Promise<{}>;
export declare function createProduct(data: typeof products.$inferInsert): Promise<number>;
export declare function updateProduct(id: number, data: Partial<typeof products.$inferInsert>): Promise<void>;
export declare function deleteProduct(id: number): Promise<void>;
export declare function replaceProductImages(productId: number, images: {
    imageUrl: string;
    altText?: string;
    displayOrder?: number;
}[]): Promise<void>;
export declare function getProductImages(productId: number): Promise<{}[]>;

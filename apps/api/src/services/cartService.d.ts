export declare function getCartItems(userId: number): Promise<{
    id: number;
    quantity: number;
    product: {
        id: number;
        collectionId: number;
        slug: string;
        nameTr: string;
        nameEn: string;
        descriptionTr: string;
        descriptionEn: string;
        compositionTr: string;
        compositionEn: string;
        storyTr: string;
        storyEn: string;
        price: number;
        stock: number;
        imageUrl: string;
        featured: number;
        createdAt: Date;
        updatedAt: Date;
    };
}[]>;
export declare function addToCart(userId: number, productId: number, quantity: number): Promise<number>;
export declare function updateCartItem(id: number, quantity: number): Promise<void>;
export declare function removeCartItem(id: number): Promise<void>;
export declare function clearCart(userId: number): Promise<void>;

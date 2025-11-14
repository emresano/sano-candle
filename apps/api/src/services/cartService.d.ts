export declare function getCartItems(userId: number): Promise<{
    [x: string]: unknown;
}[]>;
export declare function addToCart(userId: number, productId: number, quantity: number): Promise<any>;
export declare function updateCartItem(id: number, quantity: number): Promise<void>;
export declare function removeCartItem(id: number): Promise<void>;
export declare function clearCart(userId: number): Promise<void>;

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
export declare function createCheckoutSession(input: CheckoutSessionInput): Promise<{
    token: any;
    checkoutFormContent: any;
}>;
export declare function finalizeCheckout(token: string): Promise<{
    status: "success";
    orderNumber: unknown;
    message?: undefined;
} | {
    status: "failed";
    orderNumber?: undefined;
    message?: undefined;
} | {
    status: "failed";
    message: any;
    orderNumber?: undefined;
}>;
export declare function getCheckoutSessionStatus(token: string): Promise<{
    status: unknown;
    orderId: unknown;
    orderNumber: unknown;
}>;

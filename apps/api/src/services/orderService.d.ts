import { orders } from "../../../../drizzle/schema";
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
export declare function listOrders(): Promise<{}[]>;
export declare function getOrderById(id: number): Promise<{}>;
export declare function getOrderByNumber(orderNumber: string): Promise<{}>;
export declare function getOrderItems(orderId: number): Promise<{}[]>;
export declare function updateOrderStatus(id: number, status: typeof orders.$inferSelect.status): Promise<void>;
export declare function createOrder(payload: CreateOrderInput): Promise<{
    orderId: number;
    orderNumber: string;
    totalAmount: number;
}>;
export {};

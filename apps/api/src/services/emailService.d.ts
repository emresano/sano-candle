export type OrderNotificationPayload = {
    status: "success" | "failed";
    orderNumber?: string;
    totalAmount: number;
    customerName: string;
    customerEmail: string;
    errorMessage?: string;
};
export declare function sendOrderNotification(payload: OrderNotificationPayload): Promise<void>;

export declare function subscribeNewsletter(email: string): Promise<boolean>;
export declare function removeNewsletterSubscriber(email: string): Promise<void>;
export declare function saveContactMessage(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
}): Promise<void>;

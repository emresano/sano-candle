export declare function getUserByUsernameOrEmail(identifier: string): Promise<{}>;
export declare function createUser(params: {
    username: string;
    email: string;
    password: string;
    role?: "customer" | "admin";
    fullName?: string;
}): Promise<number>;
export declare function createSessionForUser(userId: number, meta: {
    userAgent?: string;
    ipAddress?: string;
}): Promise<{
    token: any;
    expiresAt: Date;
}>;
export declare function revokeSession(token: string): Promise<void>;
export declare function authenticateUser(identifier: string, password: string): Promise<{}>;

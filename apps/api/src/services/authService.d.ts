export declare function getUserByUsernameOrEmail(identifier: string): Promise<{
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    role: "customer" | "admin";
    fullName: string;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
}>;
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
export declare function authenticateUser(identifier: string, password: string): Promise<{
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    role: "customer" | "admin";
    fullName: string;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
}>;

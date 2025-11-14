export declare const ENV: {
    nodeEnv: string;
    databaseUrl: string;
    sessionSecret: string;
    sessionCookieName: string;
    sessionTtlMs: number;
    bcryptSaltRounds: number;
    corsOrigin: string;
    appUrl: string;
    iyzico: {
        apiKey: string;
        secretKey: string;
        baseUrl: string;
    };
    smtp: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        pass: string;
    };
};
export declare const isProduction: boolean;
export declare const iyzicoEnabled: boolean;
export declare const smtpConfigured: boolean;

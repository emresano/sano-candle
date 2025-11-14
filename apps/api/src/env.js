"use strict";
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtpConfigured = exports.iyzicoEnabled = exports.isProduction = exports.ENV = void 0;
var dotenv_1 = require("dotenv");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, node_path_1.dirname)(__filename);
(0, dotenv_1.config)({ path: (0, node_path_1.resolve)(__dirname, "../../../.env"), override: false });
(0, dotenv_1.config)({ path: (0, node_path_1.resolve)(__dirname, "../../.env"), override: false });
(0, dotenv_1.config)();
function requireEnv(key) {
    var value = process.env[key];
    if (!value) {
        throw new Error("Missing required environment variable: ".concat(key));
    }
    return value;
}
exports.ENV = {
    nodeEnv: (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development",
    databaseUrl: requireEnv("DATABASE_URL"),
    sessionSecret: requireEnv("SESSION_SECRET"),
    sessionCookieName: (_b = process.env.SESSION_COOKIE_NAME) !== null && _b !== void 0 ? _b : "pc_session",
    sessionTtlMs: Number((_c = process.env.SESSION_TTL_MS) !== null && _c !== void 0 ? _c : 1000 * 60 * 60 * 24 * 7),
    bcryptSaltRounds: Number((_d = process.env.BCRYPT_SALT_ROUNDS) !== null && _d !== void 0 ? _d : 12),
    corsOrigin: (_e = process.env.CORS_ORIGIN) !== null && _e !== void 0 ? _e : "http://localhost:5173",
    appUrl: (_f = process.env.APP_BASE_URL) !== null && _f !== void 0 ? _f : "http://localhost:5173",
    iyzico: {
        apiKey: process.env.IYZICO_API_KEY,
        secretKey: process.env.IYZICO_SECRET_KEY,
        baseUrl: (_g = process.env.IYZICO_BASE_URL) !== null && _g !== void 0 ? _g : "https://sandbox-api.iyzipay.com",
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
        secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : undefined,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
};
exports.isProduction = exports.ENV.nodeEnv === "production";
exports.iyzicoEnabled = Boolean(exports.ENV.iyzico.apiKey && exports.ENV.iyzico.secretKey);
exports.smtpConfigured = Boolean(exports.ENV.smtp.host && exports.ENV.smtp.user && exports.ENV.smtp.pass);

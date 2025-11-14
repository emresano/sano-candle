import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "../../../.env"), override: false });
config({ path: resolve(__dirname, "../../.env"), override: false });
config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const ENV = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: requireEnv("DATABASE_URL"),
  sessionSecret: requireEnv("SESSION_SECRET"),
  sessionCookieName: process.env.SESSION_COOKIE_NAME ?? "pc_session",
  sessionTtlMs: Number(process.env.SESSION_TTL_MS ?? 1000 * 60 * 60 * 24 * 7),
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 12),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  appUrl: process.env.APP_BASE_URL ?? "http://localhost:5173",
  iyzico: {
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    baseUrl: process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com",
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : undefined,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

export const isProduction = ENV.nodeEnv === "production";
export const iyzicoEnabled = Boolean(ENV.iyzico.apiKey && ENV.iyzico.secretKey);
export const smtpConfigured = Boolean(ENV.smtp.host && ENV.smtp.user && ENV.smtp.pass);


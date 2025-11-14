import * as schema from "../../../drizzle/schema";
export declare const db: import("drizzle-orm/mysql2").MySql2Database<typeof schema>;
export type DbClient = typeof db;

import * as schema from "../../../drizzle/schema";
export declare const db: import("drizzle-orm/mysql2").MySql2Database<typeof schema> & {
    $client: any;
};
export type DbClient = typeof db;

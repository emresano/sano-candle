import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { ENV } from "./env";
import * as schema from "../../../drizzle/schema";

const pool = mysql.createPool({
  uri: ENV.databaseUrl,
  connectionLimit: 10,
});

export const db = drizzle(pool, { schema, mode: "default" });

export type DbClient = typeof db;


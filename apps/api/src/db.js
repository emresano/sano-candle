"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var mysql2_1 = require("drizzle-orm/mysql2");
var promise_1 = require("mysql2/promise");
var env_1 = require("./env");
var schema = require("../../../drizzle/schema");
var pool = promise_1.default.createPool({
    uri: env_1.ENV.databaseUrl,
    connectionLimit: 10,
});
exports.db = (0, mysql2_1.drizzle)(pool, { schema: schema, mode: "default" });

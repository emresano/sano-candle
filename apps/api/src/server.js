"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var cookie_parser_1 = require("cookie-parser");
var morgan_1 = require("morgan");
var routes_1 = require("./routes");
var env_1 = require("./env");
var auth_1 = require("./middleware/auth");
var http_1 = require("./utils/http");
var app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.ENV.corsOrigin.split(","), credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)(env_1.isProduction ? "combined" : "dev"));
app.use(function (req, res, next) {
    void (0, auth_1.attachUser)(req, res, next);
});
app.get("/health", function (_req, res) {
    res.json({ status: "ok" });
});
app.use("/api", routes_1.default);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function (err, _req, res, _next) {
    console.error(err);
    return (0, http_1.sendError)(res, err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu", 500);
});
var port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, function () {
    console.log("API server listening on port ".concat(port));
});
exports.default = app;

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var zod_1 = require("zod");
var http_1 = require("../utils/http");
var checkoutService_1 = require("../services/checkoutService");
var router = (0, express_1.Router)();
var phonePattern = /^5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
var sessionSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(3),
    customerEmail: zod_1.z.string().email(),
    customerPhone: zod_1.z.string().regex(phonePattern, { message: "Telefon numarası 5xx xxx xx xx formatında olmalıdır" }),
    shippingAddress: zod_1.z.string().min(10),
    notes: zod_1.z.string().optional(),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.number().int().positive(),
        quantity: zod_1.z.number().int().positive(),
    }))
        .min(1),
});
router.post("/session", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, payload, result;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                parsed = sessionSchema.safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, (0, http_1.sendError)(res, (_b = (_a = parsed.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "Geçersiz veri", 400)];
                }
                payload = __assign(__assign({}, parsed.data), { customerPhone: parsed.data.customerPhone, ipAddress: req.ip });
                return [4 /*yield*/, (0, checkoutService_1.createCheckoutSession)(payload)];
            case 1:
                result = _c.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, result, 201)];
        }
    });
}); }));
router.get("/session/:token", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.params.token;
                return [4 /*yield*/, (0, checkoutService_1.getCheckoutSessionStatus)(token)];
            case 1:
                status = _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, status)];
        }
    });
}); }));
router.post("/iyzico/callback", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, status, error_1, responseHtml;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                token = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.token) !== null && _b !== void 0 ? _b : (_c = req.body) === null || _c === void 0 ? void 0 : _c.iyziToken;
                if (!token || typeof token !== "string") {
                    return [2 /*return*/, (0, http_1.sendError)(res, "Geçersiz token", 400)];
                }
                _f.label = 1;
            case 1:
                _f.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, checkoutService_1.finalizeCheckout)(token)];
            case 2:
                status = _f.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _f.sent();
                console.error("Checkout finalize error", error_1);
                status = { status: "failed", message: error_1 instanceof Error ? error_1.message : "Bilinmeyen hata" };
                return [3 /*break*/, 4];
            case 4:
                responseHtml = "<!DOCTYPE html>\n<html lang=\"tr\">\n  <body>\n    <script>\n      window.parent.postMessage({ type: \"iyzico:result\", status: \"".concat(status.status, "\", token: \"").concat(token, "\", orderNumber: \"").concat((_d = status.orderNumber) !== null && _d !== void 0 ? _d : "", "\", message: \"").concat((_e = status.message) !== null && _e !== void 0 ? _e : "", "\" }, \"*\");\n    </script>\n  </body>\n</html>");
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                res.send(responseHtml);
                return [2 /*return*/];
        }
    });
}); }));
exports.default = router;

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
var auth_1 = require("../middleware/auth");
var orderService_1 = require("../services/orderService");
var cartService_1 = require("../services/cartService");
var router = (0, express_1.Router)();
router.get("/", auth_1.requireAdmin, (0, http_1.asyncHandler)(function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, orderService_1.listOrders)()];
            case 1:
                orders = _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, orders)];
        }
    });
}); }));
router.get("/:id", auth_1.requireAuth, (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, orderService_1.getOrderById)(Number(req.params.id))];
            case 1:
                order = _a.sent();
                if (!order) {
                    return [2 /*return*/, (0, http_1.sendError)(res, "Sipariş bulunamadı", 404)];
                }
                if (req.user.role !== "admin" && order.userId !== req.user.id) {
                    return [2 /*return*/, (0, http_1.sendError)(res, "Bu siparişe erişim izniniz yok", 403)];
                }
                return [2 /*return*/, (0, http_1.sendSuccess)(res, order)];
        }
    });
}); }));
router.get("/order-number/:orderNumber", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, orderService_1.getOrderByNumber)(req.params.orderNumber)];
            case 1:
                order = _a.sent();
                if (!order) {
                    return [2 /*return*/, (0, http_1.sendError)(res, "Sipariş bulunamadı", 404)];
                }
                return [2 /*return*/, (0, http_1.sendSuccess)(res, order)];
        }
    });
}); }));
var createOrderSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(1),
    customerEmail: zod_1.z.string().email(),
    customerPhone: zod_1.z.string().optional(),
    shippingAddress: zod_1.z.string().min(1),
    paymentMethod: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.number().int().positive(),
        quantity: zod_1.z.number().int().positive(),
    }))
        .min(1),
});
router.post("/", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, order;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                parsed = createOrderSchema.safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, (0, http_1.sendError)(res, (_b = (_a = parsed.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "Geçersiz veri", 400)];
                }
                return [4 /*yield*/, (0, orderService_1.createOrder)(__assign({ userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id }, parsed.data))];
            case 1:
                order = _e.sent();
                if (!((_d = req.user) === null || _d === void 0 ? void 0 : _d.id)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, cartService_1.clearCart)(req.user.id)];
            case 2:
                _e.sent();
                _e.label = 3;
            case 3: return [2 /*return*/, (0, http_1.sendSuccess)(res, order, 201)];
        }
    });
}); }));
var statusSchema = zod_1.z.object({
    status: zod_1.z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]),
});
router.patch("/:id/status", auth_1.requireAdmin, (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                parsed = statusSchema.safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, (0, http_1.sendError)(res, (_b = (_a = parsed.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "Geçersiz veri", 400)];
                }
                return [4 /*yield*/, (0, orderService_1.updateOrderStatus)(Number(req.params.id), parsed.data.status)];
            case 1:
                _c.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, { id: Number(req.params.id), status: parsed.data.status })];
        }
    });
}); }));
router.get("/:id/items", auth_1.requireAuth, (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order, items;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, orderService_1.getOrderById)(Number(req.params.id))];
            case 1:
                order = _a.sent();
                if (!order) {
                    return [2 /*return*/, (0, http_1.sendError)(res, "Sipariş bulunamadı", 404)];
                }
                if (req.user.role !== "admin" && order.userId !== req.user.id) {
                    return [2 /*return*/, (0, http_1.sendError)(res, "Bu siparişe erişim izniniz yok", 403)];
                }
                return [4 /*yield*/, (0, orderService_1.getOrderItems)(order.id)];
            case 2:
                items = _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, items)];
        }
    });
}); }));
exports.default = router;

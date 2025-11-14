"use strict";
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
var cartService_1 = require("../services/cartService");
var router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get("/", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var items;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, cartService_1.getCartItems)(req.user.id)];
            case 1:
                items = _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, items)];
        }
    });
}); }));
var addSchema = zod_1.z.object({
    productId: zod_1.z.number().int().positive(),
    quantity: zod_1.z.number().int().positive().default(1),
});
router.post("/", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, id, items;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                parsed = addSchema.safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, (0, http_1.sendError)(res, (_b = (_a = parsed.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "Geçersiz veri", 400)];
                }
                return [4 /*yield*/, (0, cartService_1.addToCart)(req.user.id, parsed.data.productId, parsed.data.quantity)];
            case 1:
                id = _c.sent();
                return [4 /*yield*/, (0, cartService_1.getCartItems)(req.user.id)];
            case 2:
                items = _c.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, { id: id, items: items }, 201)];
        }
    });
}); }));
var updateSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().positive(),
});
router.patch("/:id", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, items;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                parsed = updateSchema.safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, (0, http_1.sendError)(res, (_b = (_a = parsed.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "Geçersiz veri", 400)];
                }
                return [4 /*yield*/, (0, cartService_1.updateCartItem)(Number(req.params.id), parsed.data.quantity)];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, cartService_1.getCartItems)(req.user.id)];
            case 2:
                items = _c.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, items)];
        }
    });
}); }));
router.delete("/:id", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var items;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, cartService_1.removeCartItem)(Number(req.params.id))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, cartService_1.getCartItems)(req.user.id)];
            case 2:
                items = _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, items)];
        }
    });
}); }));
router.delete("/", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, cartService_1.clearCart)(req.user.id)];
            case 1:
                _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, [])];
        }
    });
}); }));
exports.default = router;

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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var zod_1 = require("zod");
var http_1 = require("../utils/http");
var catalogService_1 = require("../services/catalogService");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
var collectionSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1),
    nameTr: zod_1.z.string().min(1),
    nameEn: zod_1.z.string().min(1),
    descriptionTr: zod_1.z.string().optional(),
    descriptionEn: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url().optional(),
    displayOrder: zod_1.z.number().int().nonnegative().default(0),
});
router.get("/collections", (0, http_1.asyncHandler)(function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, catalogService_1.getCollections)()];
            case 1:
                data = _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, data)];
        }
    });
}); }));
router.get("/collections/:slug", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var collection;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, catalogService_1.getCollectionBySlug)(req.params.slug)];
            case 1:
                collection = _a.sent();
                if (!collection) {
                    return [2 /*return*/, (0, http_1.sendError)(res, "Koleksiyon bulunamadı", 404)];
                }
                return [2 /*return*/, (0, http_1.sendSuccess)(res, collection)];
        }
    });
}); }));
router.post("/collections", auth_1.requireAdmin, (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, id;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                parsed = collectionSchema.safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, (0, http_1.sendError)(res, (_b = (_a = parsed.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "Geçersiz veri", 400)];
                }
                return [4 /*yield*/, (0, catalogService_1.createCollection)(parsed.data)];
            case 1:
                id = _c.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, { id: id }, 201)];
        }
    });
}); }));
router.put("/collections/:id", auth_1.requireAdmin, (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                parsed = collectionSchema.partial().safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, (0, http_1.sendError)(res, (_b = (_a = parsed.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "Geçersiz veri", 400)];
                }
                return [4 /*yield*/, (0, catalogService_1.updateCollection)(Number(req.params.id), parsed.data)];
            case 1:
                _c.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, { id: Number(req.params.id) })];
        }
    });
}); }));
router.delete("/collections/:id", auth_1.requireAdmin, (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, catalogService_1.deleteCollection)(Number(req.params.id))];
            case 1:
                _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, { id: Number(req.params.id) })];
        }
    });
}); }));
var productSchema = zod_1.z.object({
    collectionId: zod_1.z.number().int().optional(),
    slug: zod_1.z.string().min(1),
    nameTr: zod_1.z.string().min(1),
    nameEn: zod_1.z.string().min(1),
    descriptionTr: zod_1.z.string().optional(),
    descriptionEn: zod_1.z.string().optional(),
    compositionTr: zod_1.z.string().optional(),
    compositionEn: zod_1.z.string().optional(),
    storyTr: zod_1.z.string().optional(),
    storyEn: zod_1.z.string().optional(),
    price: zod_1.z.number().int().nonnegative(),
    stock: zod_1.z.number().int().nonnegative().default(0),
    imageUrl: zod_1.z.string().url().optional(),
    featured: zod_1.z.boolean().optional(),
    images: zod_1.z
        .array(zod_1.z.object({
        imageUrl: zod_1.z.string().url(),
        altText: zod_1.z.string().optional(),
        displayOrder: zod_1.z.number().int().nonnegative().optional(),
    }))
        .optional(),
});
router.get("/products", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var featured, collectionId, collectionSlug, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                featured = req.query.featured === "true";
                collectionId = req.query.collectionId ? Number(req.query.collectionId) : undefined;
                collectionSlug = typeof req.query.collectionSlug === "string" ? req.query.collectionSlug : undefined;
                return [4 /*yield*/, (0, catalogService_1.getProducts)({ featured: featured, collectionId: collectionId, collectionSlug: collectionSlug })];
            case 1:
                data = _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, data)];
        }
    });
}); }));
router.get("/products/featured", (0, http_1.asyncHandler)(function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, catalogService_1.getFeaturedProducts)()];
            case 1:
                data = _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, data)];
        }
    });
}); }));
router.get("/products/:id", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, images;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, catalogService_1.getProductById)(Number(req.params.id))];
            case 1:
                product = _a.sent();
                if (!product) {
                    return [2 /*return*/, (0, http_1.sendError)(res, "Ürün bulunamadı", 404)];
                }
                return [4 /*yield*/, (0, catalogService_1.getProductImages)(product.id)];
            case 2:
                images = _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, __assign(__assign({}, product), { images: images }))];
        }
    });
}); }));
router.get("/products/slug/:slug", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, images;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, catalogService_1.getProductBySlug)(req.params.slug)];
            case 1:
                product = _a.sent();
                if (!product) {
                    return [2 /*return*/, (0, http_1.sendError)(res, "Ürün bulunamadı", 404)];
                }
                return [4 /*yield*/, (0, catalogService_1.getProductImages)(product.id)];
            case 2:
                images = _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, __assign(__assign({}, product), { images: images }))];
        }
    });
}); }));
router.post("/products", auth_1.requireAdmin, (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, _a, images, featured, productData, id, product, productImagesData;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                parsed = productSchema.safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, (0, http_1.sendError)(res, (_c = (_b = parsed.error.issues[0]) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : "Geçersiz veri", 400)];
                }
                _a = parsed.data, images = _a.images, featured = _a.featured, productData = __rest(_a, ["images", "featured"]);
                return [4 /*yield*/, (0, catalogService_1.createProduct)(__assign(__assign({}, productData), { featured: featured ? 1 : 0 }))];
            case 1:
                id = _d.sent();
                if (!(images === null || images === void 0 ? void 0 : images.length)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, catalogService_1.replaceProductImages)(id, images)];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3: return [4 /*yield*/, (0, catalogService_1.getProductById)(id)];
            case 4:
                product = _d.sent();
                return [4 /*yield*/, (0, catalogService_1.getProductImages)(id)];
            case 5:
                productImagesData = _d.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, __assign(__assign({}, product), { images: productImagesData }), 201)];
        }
    });
}); }));
router.put("/products/:id", auth_1.requireAdmin, (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, _a, images, featured, productData, product, productImagesData;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                parsed = productSchema.partial().safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, (0, http_1.sendError)(res, (_c = (_b = parsed.error.issues[0]) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : "Geçersiz veri", 400)];
                }
                _a = parsed.data, images = _a.images, featured = _a.featured, productData = __rest(_a, ["images", "featured"]);
                return [4 /*yield*/, (0, catalogService_1.updateProduct)(Number(req.params.id), __assign(__assign({}, productData), (featured !== undefined ? { featured: featured ? 1 : 0 } : {})))];
            case 1:
                _d.sent();
                if (!images) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, catalogService_1.replaceProductImages)(Number(req.params.id), images)];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3: return [4 /*yield*/, (0, catalogService_1.getProductById)(Number(req.params.id))];
            case 4:
                product = _d.sent();
                return [4 /*yield*/, (0, catalogService_1.getProductImages)(Number(req.params.id))];
            case 5:
                productImagesData = _d.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, __assign(__assign({}, product), { images: productImagesData }))];
        }
    });
}); }));
router.delete("/products/:id", auth_1.requireAdmin, (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, catalogService_1.deleteProduct)(Number(req.params.id))];
            case 1:
                _a.sent();
                return [2 /*return*/, (0, http_1.sendSuccess)(res, { id: Number(req.params.id) })];
        }
    });
}); }));
exports.default = router;

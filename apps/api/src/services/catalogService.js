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
exports.getProductImages = exports.replaceProductImages = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProductBySlug = exports.getFeaturedProducts = exports.getProducts = exports.deleteCollection = exports.updateCollection = exports.createCollection = exports.getCollectionBySlug = exports.getCollections = void 0;
var db_1 = require("../db");
var schema_1 = require("../../../../drizzle/schema");
var drizzle_orm_1 = require("drizzle-orm");
function getCollections() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db_1.db.select().from(schema_1.collections).orderBy((0, drizzle_orm_1.asc)(schema_1.collections.displayOrder))];
        });
    });
}
exports.getCollections = getCollections;
function getCollectionBySlug(slug) {
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.collections)
                        .where((0, drizzle_orm_1.eq)(schema_1.collections.slug, slug))
                        .limit(1)];
                case 1:
                    collection = (_a.sent())[0];
                    return [2 /*return*/, collection !== null && collection !== void 0 ? collection : null];
            }
        });
    });
}
exports.getCollectionBySlug = getCollectionBySlug;
function createCollection(data) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.insert(schema_1.collections).values(data)];
                case 1:
                    result = (_a.sent())[0];
                    return [2 /*return*/, Number(result.insertId)];
            }
        });
    });
}
exports.createCollection = createCollection;
function updateCollection(id, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.update(schema_1.collections).set(data).where((0, drizzle_orm_1.eq)(schema_1.collections.id, id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateCollection = updateCollection;
function deleteCollection(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.delete(schema_1.collections).where((0, drizzle_orm_1.eq)(schema_1.collections.id, id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteCollection = deleteCollection;
function getProducts(options) {
    return __awaiter(this, void 0, void 0, function () {
        var collection, conditions, query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(options === null || options === void 0 ? void 0 : options.collectionSlug)) return [3 /*break*/, 2];
                    return [4 /*yield*/, getCollectionBySlug(options.collectionSlug)];
                case 1:
                    collection = _a.sent();
                    if (!collection)
                        return [2 /*return*/, []];
                    options.collectionId = collection.id;
                    _a.label = 2;
                case 2:
                    conditions = [];
                    if (options === null || options === void 0 ? void 0 : options.collectionId) {
                        conditions.push((0, drizzle_orm_1.eq)(schema_1.products.collectionId, options.collectionId));
                    }
                    if (options === null || options === void 0 ? void 0 : options.featured) {
                        conditions.push((0, drizzle_orm_1.eq)(schema_1.products.featured, 1));
                    }
                    query = db_1.db.select().from(schema_1.products);
                    if (conditions.length === 1) {
                        query = query.where(conditions[0]);
                    }
                    else if (conditions.length > 1) {
                        query = query.where(drizzle_orm_1.and.apply(void 0, conditions));
                    }
                    return [2 /*return*/, query.orderBy((0, drizzle_orm_1.desc)(schema_1.products.createdAt))];
            }
        });
    });
}
exports.getProducts = getProducts;
function getFeaturedProducts() {
    return __awaiter(this, arguments, void 0, function (limit) {
        if (limit === void 0) { limit = 4; }
        return __generator(this, function (_a) {
            return [2 /*return*/, db_1.db
                    .select()
                    .from(schema_1.products)
                    .where((0, drizzle_orm_1.eq)(schema_1.products.featured, 1))
                    .orderBy((0, drizzle_orm_1.desc)(schema_1.products.createdAt))
                    .limit(limit)];
        });
    });
}
exports.getFeaturedProducts = getFeaturedProducts;
function getProductBySlug(slug) {
    return __awaiter(this, void 0, void 0, function () {
        var product;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.slug, slug)).limit(1)];
                case 1:
                    product = (_a.sent())[0];
                    return [2 /*return*/, product !== null && product !== void 0 ? product : null];
            }
        });
    });
}
exports.getProductBySlug = getProductBySlug;
function getProductById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var product;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, id)).limit(1)];
                case 1:
                    product = (_a.sent())[0];
                    return [2 /*return*/, product !== null && product !== void 0 ? product : null];
            }
        });
    });
}
exports.getProductById = getProductById;
function createProduct(data) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.insert(schema_1.products).values(data)];
                case 1:
                    result = (_a.sent())[0];
                    return [2 /*return*/, Number(result.insertId)];
            }
        });
    });
}
exports.createProduct = createProduct;
function updateProduct(id, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.update(schema_1.products).set(data).where((0, drizzle_orm_1.eq)(schema_1.products.id, id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateProduct = updateProduct;
function deleteProduct(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.delete(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteProduct = deleteProduct;
function replaceProductImages(productId, images) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.delete(schema_1.productImages).where((0, drizzle_orm_1.eq)(schema_1.productImages.productId, productId))];
                case 1:
                    _a.sent();
                    if (!images.length)
                        return [2 /*return*/];
                    return [4 /*yield*/, db_1.db.insert(schema_1.productImages).values(images.map(function (image, index) {
                            var _a;
                            return ({
                                productId: productId,
                                imageUrl: image.imageUrl,
                                altText: image.altText,
                                displayOrder: (_a = image.displayOrder) !== null && _a !== void 0 ? _a : index,
                            });
                        }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.replaceProductImages = replaceProductImages;
function getProductImages(productId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db_1.db
                    .select()
                    .from(schema_1.productImages)
                    .where((0, drizzle_orm_1.eq)(schema_1.productImages.productId, productId))
                    .orderBy((0, drizzle_orm_1.asc)(schema_1.productImages.displayOrder))];
        });
    });
}
exports.getProductImages = getProductImages;

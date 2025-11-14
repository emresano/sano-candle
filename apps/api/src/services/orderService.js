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
exports.createOrder = exports.updateOrderStatus = exports.getOrderItems = exports.getOrderByNumber = exports.getOrderById = exports.listOrders = void 0;
var node_crypto_1 = require("node:crypto");
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../db");
var schema_1 = require("../../../../drizzle/schema");
function generateOrderNumber() {
    var random = node_crypto_1.default.randomBytes(3).toString("hex").toUpperCase();
    return "ORD-".concat(Date.now(), "-").concat(random);
}
function listOrders() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db_1.db.select().from(schema_1.orders).orderBy((0, drizzle_orm_1.desc)(schema_1.orders.createdAt))];
        });
    });
}
exports.listOrders = listOrders;
function getOrderById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.orders).where((0, drizzle_orm_1.eq)(schema_1.orders.id, id)).limit(1)];
                case 1:
                    order = (_a.sent())[0];
                    return [2 /*return*/, order !== null && order !== void 0 ? order : null];
            }
        });
    });
}
exports.getOrderById = getOrderById;
function getOrderByNumber(orderNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.orders).where((0, drizzle_orm_1.eq)(schema_1.orders.orderNumber, orderNumber)).limit(1)];
                case 1:
                    order = (_a.sent())[0];
                    return [2 /*return*/, order !== null && order !== void 0 ? order : null];
            }
        });
    });
}
exports.getOrderByNumber = getOrderByNumber;
function getOrderItems(orderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db_1.db.select().from(schema_1.orderItems).where((0, drizzle_orm_1.eq)(schema_1.orderItems.orderId, orderId))];
        });
    });
}
exports.getOrderItems = getOrderItems;
function updateOrderStatus(id, status) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.update(schema_1.orders).set({ status: status }).where((0, drizzle_orm_1.eq)(schema_1.orders.id, id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateOrderStatus = updateOrderStatus;
function createOrder(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, db_1.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                    var totalAmount, detailedItems, _i, _a, item, product, orderNumber, orderResult, orderId;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                totalAmount = 0;
                                detailedItems = [];
                                _i = 0, _a = payload.items;
                                _c.label = 1;
                            case 1:
                                if (!(_i < _a.length)) return [3 /*break*/, 4];
                                item = _a[_i];
                                return [4 /*yield*/, tx
                                        .select({
                                        id: schema_1.products.id,
                                        nameTr: schema_1.products.nameTr,
                                        nameEn: schema_1.products.nameEn,
                                        price: schema_1.products.price,
                                        slug: schema_1.products.slug,
                                    })
                                        .from(schema_1.products)
                                        .where((0, drizzle_orm_1.eq)(schema_1.products.id, item.productId))
                                        .limit(1)];
                            case 2:
                                product = (_c.sent())[0];
                                if (!product) {
                                    return [3 /*break*/, 3];
                                }
                                totalAmount += product.price * item.quantity;
                                detailedItems.push({
                                    productId: product.id,
                                    productName: product.nameTr,
                                    productSlug: product.slug,
                                    unitPrice: product.price,
                                    quantity: item.quantity,
                                });
                                _c.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4:
                                if (detailedItems.length === 0) {
                                    throw new Error("No valid order items found");
                                }
                                orderNumber = generateOrderNumber();
                                return [4 /*yield*/, tx.insert(schema_1.orders).values({
                                        userId: payload.userId,
                                        orderNumber: orderNumber,
                                        customerName: payload.customerName,
                                        customerEmail: payload.customerEmail,
                                        customerPhone: payload.customerPhone,
                                        shippingAddress: payload.shippingAddress,
                                        totalAmount: totalAmount,
                                        paymentMethod: payload.paymentMethod,
                                        paymentReference: payload.paymentReference,
                                        notes: payload.notes,
                                        status: (_b = payload.status) !== null && _b !== void 0 ? _b : "pending",
                                    })];
                            case 5:
                                orderResult = (_c.sent())[0];
                                orderId = Number(orderResult.insertId);
                                return [4 /*yield*/, tx.insert(schema_1.orderItems).values(detailedItems.map(function (item) {
                                        var _a;
                                        return ({
                                            orderId: orderId,
                                            productId: item.productId,
                                            productName: item.productName,
                                            productSlug: (_a = item.productSlug) !== null && _a !== void 0 ? _a : null,
                                            unitPrice: item.unitPrice,
                                            quantity: item.quantity,
                                        });
                                    }))];
                            case 6:
                                _c.sent();
                                return [2 /*return*/, {
                                        orderId: orderId,
                                        orderNumber: orderNumber,
                                        totalAmount: totalAmount,
                                    }];
                        }
                    });
                }); })];
        });
    });
}
exports.createOrder = createOrder;

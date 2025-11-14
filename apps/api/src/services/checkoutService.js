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
exports.getCheckoutSessionStatus = exports.finalizeCheckout = exports.createCheckoutSession = void 0;
var node_crypto_1 = require("node:crypto");
var iyzipay_1 = require("iyzipay");
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../db");
var schema_1 = require("../../../../drizzle/schema");
var env_1 = require("../env");
var emailService_1 = require("./emailService");
var orderService_1 = require("./orderService");
var iyzipayClient = env_1.iyzicoEnabled
    ? new iyzipay_1.default({
        apiKey: env_1.ENV.iyzico.apiKey,
        secretKey: env_1.ENV.iyzico.secretKey,
        uri: env_1.ENV.iyzico.baseUrl,
    })
    : null;
function formatPrice(amount) {
    return (amount / 100).toFixed(2);
}
function normalizePhone(phone) {
    if (!phone)
        return undefined;
    var digits = phone.replace(/\D/g, "");
    if (digits.startsWith("90")) {
        return "+".concat(digits);
    }
    if (digits.startsWith("0")) {
        return "+9".concat(digits);
    }
    if (digits.startsWith("5")) {
        return "+90".concat(digits);
    }
    return "+".concat(digits);
}
function fetchProductDetails(items) {
    return __awaiter(this, void 0, void 0, function () {
        var productIds, records, map, detailed, _i, items_1, item, record;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productIds = items.map(function (item) { return item.productId; });
                    return [4 /*yield*/, db_1.db
                            .select({
                            id: schema_1.products.id,
                            price: schema_1.products.price,
                            nameTr: schema_1.products.nameTr,
                            nameEn: schema_1.products.nameEn,
                            slug: schema_1.products.slug,
                        })
                            .from(schema_1.products)
                            .where((0, drizzle_orm_1.inArray)(schema_1.products.id, productIds))];
                case 1:
                    records = _a.sent();
                    map = new Map(records.map(function (record) { return [record.id, record]; }));
                    detailed = [];
                    for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                        item = items_1[_i];
                        record = map.get(item.productId);
                        if (!record) {
                            throw new Error("Product ".concat(item.productId, " not found"));
                        }
                        detailed.push({
                            productId: record.id,
                            quantity: item.quantity,
                            unitPrice: record.price,
                            productName: record.nameTr,
                            productSlug: record.slug,
                        });
                    }
                    return [2 /*return*/, detailed];
            }
        });
    });
}
function createCheckoutSession(input) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionItems, totalAmount, conversationId, request, initializeResult;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!iyzipayClient || !env_1.iyzicoEnabled) {
                        throw new Error("Iyzico ödeme ayarları tanımlı değil");
                    }
                    return [4 /*yield*/, fetchProductDetails(input.items)];
                case 1:
                    sessionItems = _g.sent();
                    totalAmount = sessionItems.reduce(function (sum, item) { return sum + item.unitPrice * item.quantity; }, 0);
                    if (totalAmount <= 0) {
                        throw new Error("Toplam tutar geçersiz");
                    }
                    conversationId = node_crypto_1.default.randomUUID();
                    request = {
                        locale: "tr",
                        conversationId: conversationId,
                        price: formatPrice(totalAmount),
                        paidPrice: formatPrice(totalAmount),
                        currency: iyzipay_1.default.CURRENCY.TRY,
                        basketId: conversationId,
                        paymentGroup: iyzipay_1.default.PAYMENT_GROUP.PRODUCT,
                        callbackUrl: "".concat(env_1.ENV.appUrl, "/api/checkout/iyzico/callback"),
                        buyer: {
                            id: node_crypto_1.default.randomUUID(),
                            name: (_a = input.customerName.split(" ")[0]) !== null && _a !== void 0 ? _a : input.customerName,
                            surname: input.customerName.split(" ").slice(1).join(" ") || input.customerName,
                            email: input.customerEmail,
                            gsmNumber: (_b = normalizePhone(input.customerPhone)) !== null && _b !== void 0 ? _b : "+905000000000",
                            identityNumber: "11111111111",
                            registrationAddress: input.shippingAddress,
                            city: "Istanbul",
                            country: "Turkey",
                            zipCode: "34000",
                            ip: (_c = input.ipAddress) !== null && _c !== void 0 ? _c : "127.0.0.1",
                        },
                        shippingAddress: {
                            contactName: input.customerName,
                            city: "Istanbul",
                            country: "Turkey",
                            address: input.shippingAddress,
                            zipCode: "34000",
                        },
                        billingAddress: {
                            contactName: input.customerName,
                            city: "Istanbul",
                            country: "Turkey",
                            address: input.shippingAddress,
                            zipCode: "34000",
                        },
                        basketItems: sessionItems.map(function (item, index) { return ({
                            id: String(item.productId),
                            name: item.productName,
                            category1: "Candle",
                            category2: "Home",
                            itemType: iyzipay_1.default.BASKET_ITEM_TYPE.PHYSICAL,
                            price: formatPrice(item.unitPrice * item.quantity),
                        }); }),
                    };
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            iyzipayClient.checkoutFormInitialize.create(request, function (err, result) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(result);
                                }
                            });
                        })];
                case 2:
                    initializeResult = _g.sent();
                    if (initializeResult.status !== "success" || !initializeResult.token || !initializeResult.checkoutFormContent) {
                        throw new Error((_d = initializeResult.errorMessage) !== null && _d !== void 0 ? _d : "Ödeme başlatılırken bir hata oluştu");
                    }
                    return [4 /*yield*/, db_1.db.insert(schema_1.checkoutSessions).values({
                            token: initializeResult.token,
                            conversationId: conversationId,
                            customerName: input.customerName,
                            customerEmail: input.customerEmail,
                            customerPhone: (_e = normalizePhone(input.customerPhone)) !== null && _e !== void 0 ? _e : null,
                            shippingAddress: input.shippingAddress,
                            notes: (_f = input.notes) !== null && _f !== void 0 ? _f : null,
                            itemsJson: JSON.stringify(sessionItems),
                            totalAmount: totalAmount,
                            status: "pending",
                        })];
                case 3:
                    _g.sent();
                    return [2 /*return*/, {
                            token: initializeResult.token,
                            checkoutFormContent: initializeResult.checkoutFormContent,
                        }];
            }
        });
    });
}
exports.createCheckoutSession = createCheckoutSession;
function parseStoredItems(itemsJson) {
    try {
        var parsed = JSON.parse(itemsJson);
        return parsed;
    }
    catch (error) {
        console.error("Failed to parse checkout session items", error);
        throw new Error("Sipariş detayları okunamadı");
    }
}
function markSessionStatus(token, status, orderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db
                        .update(schema_1.checkoutSessions)
                        .set({ status: status, orderId: orderId !== null && orderId !== void 0 ? orderId : null })
                        .where((0, drizzle_orm_1.eq)(schema_1.checkoutSessions.token, token))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function finalizeCheckout(token) {
    return __awaiter(this, void 0, void 0, function () {
        var session, retrieveResult, items, orderPayload, order;
        var _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!iyzipayClient || !env_1.iyzicoEnabled) {
                        throw new Error("Iyzico ödeme ayarları tanımlı değil");
                    }
                    return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.checkoutSessions)
                            .where((0, drizzle_orm_1.eq)(schema_1.checkoutSessions.token, token))
                            .limit(1)];
                case 1:
                    session = (_d.sent())[0];
                    if (!session) {
                        throw new Error("Ödeme oturumu bulunamadı");
                    }
                    if (!(session.status === "paid")) return [3 /*break*/, 3];
                    _a = { status: "success" };
                    return [4 /*yield*/, lookupOrderNumber(session.orderId)];
                case 2: return [2 /*return*/, (_a.orderNumber = _d.sent(), _a)];
                case 3:
                    if (session.status === "failed") {
                        return [2 /*return*/, { status: "failed" }];
                    }
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var _a;
                            iyzipayClient.checkoutForm.retrieve({
                                locale: "tr",
                                conversationId: (_a = session.conversationId) !== null && _a !== void 0 ? _a : "",
                                token: token,
                            }, function (err, result) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(result);
                                }
                            });
                        })];
                case 4:
                    retrieveResult = _d.sent();
                    if (!(retrieveResult.paymentStatus === "SUCCESS")) return [3 /*break*/, 8];
                    items = parseStoredItems(session.itemsJson).map(function (item) { return ({
                        productId: item.productId,
                        quantity: item.quantity,
                    }); });
                    orderPayload = {
                        customerName: session.customerName,
                        customerEmail: session.customerEmail,
                        customerPhone: (_b = session.customerPhone) !== null && _b !== void 0 ? _b : undefined,
                        shippingAddress: session.shippingAddress,
                        notes: (_c = session.notes) !== null && _c !== void 0 ? _c : undefined,
                        paymentMethod: "iyzico",
                        paymentReference: token,
                        status: "paid",
                        items: items,
                    };
                    return [4 /*yield*/, (0, orderService_1.createOrder)(orderPayload)];
                case 5:
                    order = _d.sent();
                    return [4 /*yield*/, markSessionStatus(token, "paid", order.orderId)];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, (0, emailService_1.sendOrderNotification)({
                            status: "success",
                            orderNumber: order.orderNumber,
                            totalAmount: order.totalAmount,
                            customerName: session.customerName,
                            customerEmail: session.customerEmail,
                        })];
                case 7:
                    _d.sent();
                    return [2 /*return*/, { status: "success", orderNumber: order.orderNumber }];
                case 8: return [4 /*yield*/, markSessionStatus(token, "failed")];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, (0, emailService_1.sendOrderNotification)({
                            status: "failed",
                            totalAmount: session.totalAmount,
                            customerName: session.customerName,
                            customerEmail: session.customerEmail,
                            errorMessage: retrieveResult.errorMessage,
                        })];
                case 10:
                    _d.sent();
                    return [2 /*return*/, { status: "failed", message: retrieveResult.errorMessage }];
            }
        });
    });
}
exports.finalizeCheckout = finalizeCheckout;
function lookupOrderNumber(orderId) {
    return __awaiter(this, void 0, void 0, function () {
        var order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!orderId)
                        return [2 /*return*/, undefined];
                    return [4 /*yield*/, db_1.db
                            .select({ orderNumber: schema_1.orders.orderNumber })
                            .from(schema_1.orders)
                            .where((0, drizzle_orm_1.eq)(schema_1.orders.id, orderId))
                            .limit(1)];
                case 1:
                    order = (_a.sent())[0];
                    return [2 /*return*/, order === null || order === void 0 ? void 0 : order.orderNumber];
            }
        });
    });
}
function getCheckoutSessionStatus(token) {
    return __awaiter(this, void 0, void 0, function () {
        var session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db
                        .select({
                        status: schema_1.checkoutSessions.status,
                        orderId: schema_1.checkoutSessions.orderId,
                        totalAmount: schema_1.checkoutSessions.totalAmount,
                        orderNumber: schema_1.orders.orderNumber,
                    })
                        .from(schema_1.checkoutSessions)
                        .leftJoin(schema_1.orders, (0, drizzle_orm_1.eq)(schema_1.orders.id, schema_1.checkoutSessions.orderId))
                        .where((0, drizzle_orm_1.eq)(schema_1.checkoutSessions.token, token))
                        .limit(1)];
                case 1:
                    session = (_a.sent())[0];
                    if (!session) {
                        throw new Error("Oturum bulunamadı");
                    }
                    return [2 /*return*/, {
                            status: session.status,
                            orderId: session.orderId,
                            orderNumber: session.orderNumber,
                        }];
            }
        });
    });
}
exports.getCheckoutSessionStatus = getCheckoutSessionStatus;

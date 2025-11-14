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
exports.authenticateUser = exports.revokeSession = exports.createSessionForUser = exports.createUser = exports.getUserByUsernameOrEmail = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../db");
var schema_1 = require("../../../../drizzle/schema");
var auth_1 = require("../utils/auth");
var env_1 = require("../env");
function getUserByUsernameOrEmail(identifier) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.users)
                        .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.username, identifier), (0, drizzle_orm_1.eq)(schema_1.users.email, identifier)))
                        .limit(1)];
                case 1:
                    user = (_a.sent())[0];
                    return [2 /*return*/, user !== null && user !== void 0 ? user : null];
            }
        });
    });
}
exports.getUserByUsernameOrEmail = getUserByUsernameOrEmail;
function createUser(params) {
    return __awaiter(this, void 0, void 0, function () {
        var passwordHash, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, auth_1.hashPassword)(params.password)];
                case 1:
                    passwordHash = _b.sent();
                    return [4 /*yield*/, db_1.db
                            .insert(schema_1.users)
                            .values({
                            username: params.username,
                            email: params.email,
                            passwordHash: passwordHash,
                            role: (_a = params.role) !== null && _a !== void 0 ? _a : "customer",
                            fullName: params.fullName,
                        })];
                case 2:
                    result = (_b.sent())[0];
                    return [2 /*return*/, Number(result.insertId)];
            }
        });
    });
}
exports.createUser = createUser;
function createSessionForUser(userId, meta) {
    return __awaiter(this, void 0, void 0, function () {
        var token, tokenHash, expiresAt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = (0, auth_1.generateSessionToken)();
                    tokenHash = (0, auth_1.hashToken)(token);
                    expiresAt = new Date(Date.now() + env_1.ENV.sessionTtlMs);
                    return [4 /*yield*/, db_1.db.insert(schema_1.sessions).values({
                            userId: userId,
                            tokenHash: tokenHash,
                            expiresAt: expiresAt,
                            userAgent: meta.userAgent,
                            ipAddress: meta.ipAddress,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.update(schema_1.users).set({ lastLoginAt: new Date() }).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { token: token, expiresAt: expiresAt }];
            }
        });
    });
}
exports.createSessionForUser = createSessionForUser;
function revokeSession(token) {
    return __awaiter(this, void 0, void 0, function () {
        var hashed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hashed = (0, auth_1.hashToken)(token);
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.sessions)
                            .set({ revokedAt: new Date() })
                            .where((0, drizzle_orm_1.eq)(schema_1.sessions.tokenHash, hashed))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.revokeSession = revokeSession;
function authenticateUser(identifier, password) {
    return __awaiter(this, void 0, void 0, function () {
        var user, valid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getUserByUsernameOrEmail(identifier)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, (0, auth_1.verifyPassword)(password, user.passwordHash)];
                case 2:
                    valid = _a.sent();
                    if (!valid) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, user];
            }
        });
    });
}
exports.authenticateUser = authenticateUser;

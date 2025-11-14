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
var authService_1 = require("../services/authService");
var env_1 = require("../env");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
var loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Kullanıcı adı gereklidir"),
    password: zod_1.z.string().min(1, "Şifre gereklidir"),
});
router.post("/login", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, user, _a, token, expiresAt;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                parsed = loginSchema.safeParse(req.body);
                if (!parsed.success) {
                    return [2 /*return*/, (0, http_1.sendError)(res, (_c = (_b = parsed.error.issues[0]) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : "Geçersiz veri", 400)];
                }
                return [4 /*yield*/, (0, authService_1.authenticateUser)(parsed.data.username, parsed.data.password)];
            case 1:
                user = _e.sent();
                if (!user) {
                    return [2 /*return*/, (0, http_1.sendError)(res, "Kullanıcı adı veya şifre hatalı", 401)];
                }
                return [4 /*yield*/, (0, authService_1.createSessionForUser)(user.id, {
                        userAgent: (_d = req.get("user-agent")) !== null && _d !== void 0 ? _d : undefined,
                        ipAddress: req.ip,
                    })];
            case 2:
                _a = _e.sent(), token = _a.token, expiresAt = _a.expiresAt;
                res.cookie(env_1.ENV.sessionCookieName, token, {
                    httpOnly: true,
                    secure: env_1.isProduction,
                    sameSite: "lax",
                    expires: expiresAt,
                    path: "/",
                });
                return [2 /*return*/, (0, http_1.sendSuccess)(res, {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        fullName: user.fullName,
                    })];
        }
    });
}); }));
router.post("/logout", auth_1.requireAuth, (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.sessionToken) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, authService_1.revokeSession)(req.sessionToken)];
            case 1:
                _a.sent();
                res.clearCookie(env_1.ENV.sessionCookieName, {
                    httpOnly: true,
                    secure: env_1.isProduction,
                    sameSite: "lax",
                    path: "/",
                });
                _a.label = 2;
            case 2: return [2 /*return*/, (0, http_1.sendSuccess)(res, { success: true })];
        }
    });
}); }));
router.get("/me", (0, http_1.asyncHandler)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!req.user) {
            return [2 /*return*/, (0, http_1.sendSuccess)(res, null)];
        }
        return [2 /*return*/, (0, http_1.sendSuccess)(res, {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role,
                fullName: req.user.fullName,
            })];
    });
}); }));
exports.default = router;

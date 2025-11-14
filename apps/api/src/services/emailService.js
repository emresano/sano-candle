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
exports.sendOrderNotification = void 0;
var nodemailer_1 = require("nodemailer");
var env_1 = require("../env");
var siteSettingsService_1 = require("./siteSettingsService");
var transporter = null;
function getTransporter() {
    var _a, _b;
    if (!env_1.smtpConfigured) {
        return null;
    }
    if (!transporter) {
        transporter = nodemailer_1.default.createTransport({
            host: env_1.ENV.smtp.host,
            port: (_a = env_1.ENV.smtp.port) !== null && _a !== void 0 ? _a : 587,
            secure: (_b = env_1.ENV.smtp.secure) !== null && _b !== void 0 ? _b : false,
            auth: env_1.ENV.smtp.user && env_1.ENV.smtp.pass ? { user: env_1.ENV.smtp.user, pass: env_1.ENV.smtp.pass } : undefined,
        });
    }
    return transporter;
}
function formatAmount(amount) {
    return "".concat((amount / 100).toFixed(2), " TL");
}
function sendOrderNotification(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var transporterInstance, settings, recipient, subject, html;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    transporterInstance = getTransporter();
                    if (!transporterInstance) {
                        console.warn("SMTP configuration missing; skipping email notification");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, siteSettingsService_1.getSiteSettings)()];
                case 1:
                    settings = _e.sent();
                    recipient = settings.notificationEmail || settings.contactEmail || env_1.ENV.smtp.user;
                    if (!recipient) {
                        console.warn("No notification email configured; skipping email notification");
                        return [2 /*return*/];
                    }
                    subject = payload.status === "success"
                        ? "[Premium Candles] Yeni Sipari\u015F Onay\u0131 - ".concat((_a = payload.orderNumber) !== null && _a !== void 0 ? _a : "")
                        : "[Premium Candles] \u00D6deme Ba\u015Far\u0131s\u0131z";
                    html = payload.status === "success"
                        ? "<p>Merhaba,</p>\n       <p>Yeni bir sipari\u015F ba\u015Far\u0131yla olu\u015Fturuldu.</p>\n       <ul>\n         <li><strong>Sipari\u015F Numaras\u0131:</strong> ".concat((_b = payload.orderNumber) !== null && _b !== void 0 ? _b : "-", "</li>\n         <li><strong>Tutar:</strong> ").concat(formatAmount(payload.totalAmount), "</li>\n         <li><strong>M\u00FC\u015Fteri:</strong> ").concat(payload.customerName, " (").concat(payload.customerEmail, ")</li>\n       </ul>\n       <p>Detaylar\u0131 y\u00F6netici panelinden g\u00F6r\u00FCnt\u00FCleyebilirsiniz.</p>")
                        : "<p>Merhaba,</p>\n       <p>Bir \u00F6deme denemesi ba\u015Far\u0131s\u0131z oldu.</p>\n       <ul>\n         <li><strong>M\u00FC\u015Fteri:</strong> ".concat(payload.customerName, " (").concat(payload.customerEmail, ")</li>\n         <li><strong>Tutar:</strong> ").concat(formatAmount(payload.totalAmount), "</li>\n         <li><strong>Hata:</strong> ").concat((_c = payload.errorMessage) !== null && _c !== void 0 ? _c : "Bilinmiyor", "</li>\n       </ul>\n       <p>\u0130lgili kullan\u0131c\u0131 ile ileti\u015Fime ge\u00E7meniz \u00F6nerilir.</p>");
                    return [4 /*yield*/, transporterInstance.sendMail({
                            from: (_d = env_1.ENV.smtp.user) !== null && _d !== void 0 ? _d : recipient,
                            to: recipient,
                            subject: subject,
                            html: html,
                        })];
                case 2:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendOrderNotification = sendOrderNotification;

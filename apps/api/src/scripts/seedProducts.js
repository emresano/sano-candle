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
var db_1 = require("../db");
var schema_1 = require("../../../../drizzle/schema");
function seedProducts() {
    return __awaiter(this, void 0, void 0, function () {
        var minimalCollection, luxuryCollection, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🌱 Seeding products...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    // Koleksiyonları oluştur
                    console.log("Creating collections...");
                    return [4 /*yield*/, db_1.db
                            .insert(schema_1.collections)
                            .values({
                            name: "Minimal Seri",
                            slug: "minimal-seri",
                            description: "Sade ve zarif tasarımlar. Minimalist estetiği seven herkes için.",
                            imageUrl: "/images/02-minimal-seri-banner.png",
                            displayOrder: 1,
                            isActive: true,
                        })
                            .onDuplicateKeyUpdate({
                            set: { name: "Minimal Seri" },
                        })];
                case 2:
                    minimalCollection = (_a.sent())[0];
                    return [4 /*yield*/, db_1.db
                            .insert(schema_1.collections)
                            .values({
                            name: "Lüks Seri",
                            slug: "luks-seri",
                            description: "Premium malzemeler ve sofistike kokular. Özel anlar için.",
                            imageUrl: "/images/03-luks-seri-banner.png",
                            displayOrder: 2,
                            isActive: true,
                        })
                            .onDuplicateKeyUpdate({
                            set: { name: "Lüks Seri" },
                        })];
                case 3:
                    luxuryCollection = (_a.sent())[0];
                    console.log("✅ Collections created");
                    // Minimal Seri Ürünleri
                    console.log("Creating Minimal Series products...");
                    return [4 /*yield*/, db_1.db.insert(schema_1.products).values([
                            {
                                name: "Lavender Dreams",
                                nameTr: "Lavanta Rüyası",
                                slug: "lavender-dreams",
                                description: "Calming lavender scent with vanilla notes. Perfect for relaxation and meditation.",
                                descriptionTr: "Vanilya notalarıyla sakinleştirici lavanta kokusu. Rahatlama ve meditasyon için mükemmel.",
                                price: 299.00,
                                stockQuantity: 50,
                                imageUrl: "/images/02-minimal-seri-banner.png",
                                collectionId: minimalCollection.insertId,
                                isActive: true,
                                isFeatured: true,
                            },
                            {
                                name: "Ocean Breeze",
                                nameTr: "Okyanus Esintisi",
                                slug: "ocean-breeze",
                                description: "Fresh ocean scent with hints of sea salt and citrus. Brings the beach to your home.",
                                descriptionTr: "Deniz tuzu ve narenciye notalarıyla taze okyanus kokusu. Plajı evinize getirir.",
                                price: 299.00,
                                stockQuantity: 45,
                                imageUrl: "/images/02-minimal-seri-banner.png",
                                collectionId: minimalCollection.insertId,
                                isActive: true,
                                isFeatured: true,
                            },
                            {
                                name: "Citrus Burst",
                                nameTr: "Narenciye Patlaması",
                                slug: "citrus-burst",
                                description: "Energizing blend of orange, lemon, and grapefruit. Perfect for morning rituals.",
                                descriptionTr: "Portakal, limon ve greyfurt'un enerjik karışımı. Sabah ritüelleri için mükemmel.",
                                price: 299.00,
                                stockQuantity: 40,
                                imageUrl: "/images/02-minimal-seri-banner.png",
                                collectionId: minimalCollection.insertId,
                                isActive: true,
                                isFeatured: false,
                            },
                        ])];
                case 4:
                    _a.sent();
                    console.log("✅ Minimal Series products created");
                    // Lüks Seri Ürünleri
                    console.log("Creating Luxury Series products...");
                    return [4 /*yield*/, db_1.db.insert(schema_1.products).values([
                            {
                                name: "Amber Glow",
                                nameTr: "Kehribar Işıltısı",
                                slug: "amber-glow",
                                description: "Warm amber with sandalwood and musk. Luxurious and sophisticated scent.",
                                descriptionTr: "Sandal ağacı ve misk ile sıcak kehribar. Lüks ve sofistike koku.",
                                price: 399.00,
                                stockQuantity: 30,
                                imageUrl: "/images/03-luks-seri-banner.png",
                                collectionId: luxuryCollection.insertId,
                                isActive: true,
                                isFeatured: true,
                            },
                            {
                                name: "Rose Garden",
                                nameTr: "Gül Bahçesi",
                                slug: "rose-garden",
                                description: "Premium rose petals with jasmine and peony. Romantic and elegant.",
                                descriptionTr: "Yasemin ve şakayık ile premium gül yaprakları. Romantik ve zarif.",
                                price: 399.00,
                                stockQuantity: 25,
                                imageUrl: "/images/03-luks-seri-banner.png",
                                collectionId: luxuryCollection.insertId,
                                isActive: true,
                                isFeatured: true,
                            },
                            {
                                name: "Firewood & Vanilla",
                                nameTr: "Odun Ateşi & Vanilya",
                                slug: "firewood-vanilla",
                                description: "Smoky firewood with sweet vanilla and cinnamon. Cozy winter nights.",
                                descriptionTr: "Tatlı vanilya ve tarçın ile dumanlı odun ateşi. Sıcak kış geceleri.",
                                price: 399.00,
                                stockQuantity: 35,
                                imageUrl: "/images/03-luks-seri-banner.png",
                                collectionId: luxuryCollection.insertId,
                                isActive: true,
                                isFeatured: false,
                            },
                        ])];
                case 5:
                    _a.sent();
                    console.log("✅ Luxury Series products created");
                    console.log("🎉 Seeding completed successfully!");
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("❌ Seeding failed:", error_1);
                    throw error_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
seedProducts()
    .then(function () { return process.exit(0); })
    .catch(function () { return process.exit(1); });

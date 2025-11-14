"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactMessages = exports.newsletterSubscribers = exports.checkoutSessions = exports.orderItems = exports.orders = exports.cartItems = exports.productImages = exports.products = exports.collections = exports.siteSettings = exports.sessions = exports.users = void 0;
var mysql_core_1 = require("drizzle-orm/mysql-core");
exports.users = (0, mysql_core_1.mysqlTable)("users", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    username: (0, mysql_core_1.varchar)("username", { length: 100 }).notNull().unique(),
    email: (0, mysql_core_1.varchar)("email", { length: 320 }).notNull().unique(),
    passwordHash: (0, mysql_core_1.varchar)("password_hash", { length: 255 }).notNull(),
    role: (0, mysql_core_1.mysqlEnum)("role", ["customer", "admin"]).default("customer").notNull(),
    fullName: (0, mysql_core_1.varchar)("full_name", { length: 255 }),
    lastLoginAt: (0, mysql_core_1.timestamp)("last_login_at"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
});
exports.sessions = (0, mysql_core_1.mysqlTable)("sessions", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    userId: (0, mysql_core_1.int)("user_id")
        .notNull()
        .references(function () { return exports.users.id; }, { onDelete: "cascade" }),
    tokenHash: (0, mysql_core_1.char)("token_hash", { length: 64 }).notNull().unique(),
    expiresAt: (0, mysql_core_1.timestamp)("expires_at").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    revokedAt: (0, mysql_core_1.timestamp)("revoked_at"),
    userAgent: (0, mysql_core_1.varchar)("user_agent", { length: 255 }),
    ipAddress: (0, mysql_core_1.varchar)("ip_address", { length: 45 }),
});
exports.siteSettings = (0, mysql_core_1.mysqlTable)("site_settings", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    contactEmail: (0, mysql_core_1.varchar)("contact_email", { length: 320 }).notNull().default("info@premiumcandles.com"),
    instagramUrl: (0, mysql_core_1.varchar)("instagram_url", { length: 512 }),
    facebookUrl: (0, mysql_core_1.varchar)("facebook_url", { length: 512 }),
    notificationEmail: (0, mysql_core_1.varchar)("notification_email", { length: 320 }).default("emrekocakoglu@gmail.com"),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
});
exports.collections = (0, mysql_core_1.mysqlTable)("collections", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    slug: (0, mysql_core_1.varchar)("slug", { length: 255 }).notNull().unique(),
    nameTr: (0, mysql_core_1.varchar)("name_tr", { length: 255 }).notNull(),
    nameEn: (0, mysql_core_1.varchar)("name_en", { length: 255 }).notNull(),
    descriptionTr: (0, mysql_core_1.text)("description_tr"),
    descriptionEn: (0, mysql_core_1.text)("description_en"),
    imageUrl: (0, mysql_core_1.varchar)("image_url", { length: 512 }),
    displayOrder: (0, mysql_core_1.int)("display_order").default(0).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
});
exports.products = (0, mysql_core_1.mysqlTable)("products", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    collectionId: (0, mysql_core_1.int)("collection_id")
        .references(function () { return exports.collections.id; }, { onDelete: "set null" }),
    slug: (0, mysql_core_1.varchar)("slug", { length: 255 }).notNull().unique(),
    nameTr: (0, mysql_core_1.varchar)("name_tr", { length: 255 }).notNull(),
    nameEn: (0, mysql_core_1.varchar)("name_en", { length: 255 }).notNull(),
    descriptionTr: (0, mysql_core_1.text)("description_tr"),
    descriptionEn: (0, mysql_core_1.text)("description_en"),
    compositionTr: (0, mysql_core_1.text)("composition_tr"),
    compositionEn: (0, mysql_core_1.text)("composition_en"),
    storyTr: (0, mysql_core_1.text)("story_tr"),
    storyEn: (0, mysql_core_1.text)("story_en"),
    price: (0, mysql_core_1.int)("price").notNull(),
    stock: (0, mysql_core_1.int)("stock").default(0).notNull(),
    imageUrl: (0, mysql_core_1.varchar)("image_url", { length: 512 }),
    featured: (0, mysql_core_1.tinyint)("featured").default(0).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
});
exports.productImages = (0, mysql_core_1.mysqlTable)("product_images", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    productId: (0, mysql_core_1.int)("product_id")
        .notNull()
        .references(function () { return exports.products.id; }, { onDelete: "cascade" }),
    imageUrl: (0, mysql_core_1.varchar)("image_url", { length: 512 }).notNull(),
    altText: (0, mysql_core_1.varchar)("alt_text", { length: 255 }),
    displayOrder: (0, mysql_core_1.int)("display_order").default(0).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.cartItems = (0, mysql_core_1.mysqlTable)("cart_items", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    userId: (0, mysql_core_1.int)("user_id")
        .notNull()
        .references(function () { return exports.users.id; }, { onDelete: "cascade" }),
    productId: (0, mysql_core_1.int)("product_id")
        .notNull()
        .references(function () { return exports.products.id; }, { onDelete: "cascade" }),
    quantity: (0, mysql_core_1.int)("quantity").default(1).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
});
exports.orders = (0, mysql_core_1.mysqlTable)("orders", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    userId: (0, mysql_core_1.int)("user_id")
        .references(function () { return exports.users.id; }, { onDelete: "set null" }),
    orderNumber: (0, mysql_core_1.varchar)("order_number", { length: 64 }).notNull().unique(),
    customerName: (0, mysql_core_1.varchar)("customer_name", { length: 255 }).notNull(),
    customerEmail: (0, mysql_core_1.varchar)("customer_email", { length: 320 }).notNull(),
    customerPhone: (0, mysql_core_1.varchar)("customer_phone", { length: 50 }),
    shippingAddress: (0, mysql_core_1.text)("shipping_address").notNull(),
    totalAmount: (0, mysql_core_1.int)("total_amount").notNull(),
    status: (0, mysql_core_1.mysqlEnum)("status", [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ])
        .default("pending")
        .notNull(),
    paymentMethod: (0, mysql_core_1.varchar)("payment_method", { length: 50 }),
    paymentReference: (0, mysql_core_1.varchar)("payment_reference", { length: 255 }),
    notes: (0, mysql_core_1.text)("notes"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
});
exports.orderItems = (0, mysql_core_1.mysqlTable)("order_items", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    orderId: (0, mysql_core_1.int)("order_id")
        .notNull()
        .references(function () { return exports.orders.id; }, { onDelete: "cascade" }),
    productId: (0, mysql_core_1.int)("product_id")
        .references(function () { return exports.products.id; }, { onDelete: "set null" }),
    productName: (0, mysql_core_1.varchar)("product_name", { length: 255 }).notNull(),
    productSlug: (0, mysql_core_1.varchar)("product_slug", { length: 255 }),
    unitPrice: (0, mysql_core_1.int)("unit_price").notNull(),
    quantity: (0, mysql_core_1.int)("quantity").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.checkoutSessions = (0, mysql_core_1.mysqlTable)("checkout_sessions", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    token: (0, mysql_core_1.varchar)("token", { length: 255 }).notNull().unique(),
    conversationId: (0, mysql_core_1.varchar)("conversation_id", { length: 255 }),
    customerName: (0, mysql_core_1.varchar)("customer_name", { length: 255 }).notNull(),
    customerEmail: (0, mysql_core_1.varchar)("customer_email", { length: 320 }).notNull(),
    customerPhone: (0, mysql_core_1.varchar)("customer_phone", { length: 50 }),
    shippingAddress: (0, mysql_core_1.text)("shipping_address").notNull(),
    notes: (0, mysql_core_1.text)("notes"),
    itemsJson: (0, mysql_core_1.text)("items_json").notNull(),
    totalAmount: (0, mysql_core_1.int)("total_amount").notNull(),
    status: (0, mysql_core_1.mysqlEnum)("status", ["pending", "paid", "failed"]).default("pending").notNull(),
    orderId: (0, mysql_core_1.int)("order_id").references(function () { return exports.orders.id; }, { onDelete: "set null" }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
});
exports.newsletterSubscribers = (0, mysql_core_1.mysqlTable)("newsletter_subscribers", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    email: (0, mysql_core_1.varchar)("email", { length: 320 }).notNull().unique(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.contactMessages = (0, mysql_core_1.mysqlTable)("contact_messages", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, mysql_core_1.varchar)("email", { length: 320 }).notNull(),
    phone: (0, mysql_core_1.varchar)("phone", { length: 50 }),
    message: (0, mysql_core_1.text)("message").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
});

import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ProductManager from "../components/admin/ProductManager";
import OrderManager from "../components/admin/OrderManager";
import CollectionManager from "../components/admin/CollectionManager";
import SiteSettingsManager from "../components/admin/SiteSettingsManager";

export default function AdminPage() {
  const { user, login, logout, loading, error } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"products" | "collections" | "orders" | "settings">("products");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login(credentials.username, credentials.password);
      setStatus(null);
    } catch (err) {
      setStatus(language === "tr" ? "Giriş başarısız." : "Login failed.");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderLogin = () => (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-brand-beige px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-serif font-light text-brand-brown">
          {language === "tr" ? "Admin Girişi" : "Admin Login"}
        </h1>
        <div>
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "Kullanıcı Adı" : "Username"}
          </label>
          <input
            value={credentials.username}
            onChange={(event) => setCredentials((prev) => ({ ...prev, username: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-4 py-3 text-sm outline-none focus:border-brand-accent"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "Şifre" : "Password"}
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-4 py-3 text-sm outline-none focus:border-brand-accent"
            required
          />
        </div>
        {(status || error) && <p className="text-sm text-red-500">{status ?? (language === "tr" ? "Hatalı giriş." : "Incorrect credentials.")}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-warm-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-warm-600 disabled:cursor-not-allowed disabled:bg-warm-300"
        >
          {loading ? (language === "tr" ? "Giriş yapılıyor..." : "Signing in...") : language === "tr" ? "Giriş Yap" : "Sign In"}
        </button>
      </form>
    </div>
  );

  if (!user || user.role !== "admin") {
    return renderLogin();
  }

  return (
    <div className="bg-brand-beige py-16">
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-brand-brown/60">
              {language === "tr" ? "Hoş geldiniz" : "Welcome"}
            </p>
            <h1 className="text-3xl font-serif font-light text-brand-brown">{user.fullName ?? user.username}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-warm-500 px-4 py-2 text-sm font-medium text-warm-600 transition hover:bg-warm-100"
          >
            {language === "tr" ? "Çıkış Yap" : "Log Out"}
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`rounded-full px-6 py-3 text-sm font-medium transition ${
              activeTab === "products"
                ? "bg-warm-500 text-white"
                : "border border-warm-500 text-warm-600 hover:bg-warm-100"
            }`}
          >
            {language === "tr" ? "Ürünler" : "Products"}
          </button>
          <button
            onClick={() => setActiveTab("collections")}
            className={`rounded-full px-6 py-3 text-sm font-medium transition ${
              activeTab === "collections"
                ? "bg-warm-500 text-white"
                : "border border-warm-500 text-warm-600 hover:bg-warm-100"
            }`}
          >
            {language === "tr" ? "Koleksiyonlar" : "Collections"}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`rounded-full px-6 py-3 text-sm font-medium transition ${
              activeTab === "orders"
                ? "bg-warm-500 text-white"
                : "border border-warm-500 text-warm-600 hover:bg-warm-100"
            }`}
          >
            {language === "tr" ? "Siparişler" : "Orders"}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`rounded-full px-6 py-3 text-sm font-medium transition ${
              activeTab === "settings"
                ? "bg-warm-500 text-white"
                : "border border-warm-500 text-warm-600 hover:bg-warm-100"
            }`}
          >
            {language === "tr" ? "Ayarlar" : "Settings"}
          </button>
        </div>

        {activeTab === "products" ? (
          <ProductManager />
        ) : activeTab === "collections" ? (
          <CollectionManager />
        ) : activeTab === "orders" ? (
          <OrderManager />
        ) : (
          <SiteSettingsManager />
        )}
      </div>
    </div>
  );
}


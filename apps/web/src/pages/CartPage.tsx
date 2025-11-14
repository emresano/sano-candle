import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clear, total } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const isEmpty = items.length === 0;

  return (
    <div className="bg-[#FDFCFB] py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-serif font-light text-brand-brown">
              {language === "tr" ? "Sepetim" : "My Cart"}
            </h1>
            {!isEmpty && (
              <button
                onClick={clear}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-100"
              >
                <Trash2 size={16} />
                {language === "tr" ? "Sepeti Temizle" : "Clear Cart"}
              </button>
            )}
          </div>

          {isEmpty ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-brand-tan bg-white/70">
              <p className="text-lg font-medium text-brand-brown">
                {language === "tr" ? "Sepetiniz boş" : "Your cart is empty"}
              </p>
              <p className="mt-2 text-sm text-brand-brown/70">
                {language === "tr" ? "Alışverişe başlamak için ürünlerimize göz atın" : "Browse our products to start shopping"}
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="mt-6 rounded-full bg-warm-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-warm-600"
              >
                {language === "tr" ? "Ürünlere Git" : "Go to Products"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((line) => (
                <div
                  key={line.product.id}
                  className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center"
                >
                  <div className="h-24 w-24 overflow-hidden rounded-2xl bg-brand-beige">
                    {line.product.imageUrl ? (
                      <img
                        src={line.product.imageUrl}
                        alt={language === "tr" ? line.product.nameTr : line.product.nameEn}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-brand-brown/60">
                        {language === "tr" ? "Görsel Yok" : "No Image"}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    <h3 className="text-lg font-serif font-medium text-brand-brown">
                      {language === "tr" ? line.product.nameTr : line.product.nameEn}
                    </h3>
                    <p className="text-brand-brown/70">
                      {(line.product.price / 100).toFixed(2)} TL
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-full border border-brand-tan bg-white">
                        <button
                          onClick={() => updateQuantity(line.product.id, line.quantity - 1)}
                          className="rounded-l-full p-2 text-brand-brown transition hover:bg-brand-tan/60"
                          aria-label="Azalt"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 text-base font-medium">{line.quantity}</span>
                        <button
                          onClick={() => updateQuantity(line.product.id, line.quantity + 1)}
                          className="rounded-r-full p-2 text-brand-brown transition hover:bg-brand-tan/60"
                          aria-label="Arttır"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(line.product.id)}
                        className="text-sm font-medium text-red-500 transition hover:underline"
                      >
                        {language === "tr" ? "Kaldır" : "Remove"}
                      </button>
                    </div>
                  </div>

                  <div className="text-right text-lg font-semibold text-brand-accent">
                    {((line.product.price * line.quantity) / 100).toFixed(2)} TL
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-serif font-light text-brand-brown">
            {language === "tr" ? "Sipariş Özeti" : "Order Summary"}
          </h2>
          <div className="mt-6 space-y-4 text-sm text-brand-brown/70">
            <div className="flex justify-between">
              <span>{language === "tr" ? "Ara Toplam" : "Subtotal"}</span>
              <span>{(total / 100).toFixed(2)} TL</span>
            </div>
            <div className="flex justify-between">
              <span>{language === "tr" ? "Kargo" : "Shipping"}</span>
              <span>{language === "tr" ? "Ücretsiz" : "Free"}</span>
            </div>
            <div className="flex justify-between border-t border-brand-tan pt-4 text-base font-semibold text-brand-brown">
              <span>{language === "tr" ? "Toplam" : "Total"}</span>
              <span>{(total / 100).toFixed(2)} TL</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate("/checkout")}
              disabled={isEmpty}
              className="w-full rounded-full bg-warm-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-warm-600 disabled:cursor-not-allowed disabled:bg-warm-300"
            >
              {language === "tr" ? "Ödemeye Geç" : "Proceed to Checkout"}
            </button>
            <button
              onClick={() => navigate("/shop")}
              className="w-full rounded-full border border-warm-500 px-6 py-3 text-sm font-medium text-warm-600 transition hover:bg-warm-100"
            >
              {language === "tr" ? "Alışverişe Devam Et" : "Continue Shopping"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


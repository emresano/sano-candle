import { FormEvent, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const phonePattern = /^5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;

type FormState = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes: string;
};

type Step = "form" | "payment" | "result";

type CheckoutResult = {
  status: "success" | "failed";
  orderNumber?: string;
  message?: string;
};

const initialForm: FormState = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  shippingAddress: "",
  notes: "",
};

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { language } = useLanguage();
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [itemsSnapshot, setItemsSnapshot] = useState<typeof items>([]);
  const [totalSnapshot, setTotalSnapshot] = useState<number>(0);

  const hasItems = items.length > 0 || itemsSnapshot.length > 0;

  const summaryItems = useMemo(() => (step === "form" ? items : itemsSnapshot), [step, items, itemsSnapshot]);
  const summaryTotal = step === "form" ? total : totalSnapshot;

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.data || typeof event.data !== "object") return;
      if (event.data.type !== "iyzico:result") return;
      if (sessionToken && event.data.token !== sessionToken) return;

      const payload = event.data as { status: "success" | "failed"; token: string; orderNumber?: string; message?: string };
      void finalizeFromCallback(payload.status, payload.orderNumber, payload.message);
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) {
      setError(language === "tr" ? "Sepetiniz boş." : "Your cart is empty.");
      return;
    }

    if (!phonePattern.test(form.customerPhone)) {
      setError(language === "tr" ? "Telefon numarası 5xx xxx xx xx formatında olmalıdır." : "Phone number must follow 5xx xxx xx xx format.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/checkout/session", {
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        shippingAddress: form.shippingAddress,
        notes: form.notes,
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      });

      const { checkoutFormContent, token } = response.data.data as { checkoutFormContent: string; token: string };
      setItemsSnapshot(items);
      setTotalSnapshot(total);
      setCheckoutHtml(checkoutFormContent);
      setSessionToken(token);
      setStep("payment");
    } catch (err) {
      console.error(err);
      setError(language === "tr" ? "Ödeme başlatılamadı. Lütfen bilgilerinizi kontrol edin." : "Unable to initiate the payment. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  const finalizeFromCallback = async (status: "success" | "failed", orderNumber?: string, message?: string) => {
    if (!sessionToken) return;
    try {
      const response = await api.get(`/checkout/session/${sessionToken}`);
      const data = response.data.data as { status: string; orderNumber?: string };
      const resolvedOrderNumber = data.orderNumber ?? orderNumber;

      if (status === "success" || data.status === "paid") {
        setResult({ status: "success", orderNumber: resolvedOrderNumber ?? undefined });
        clear();
      } else {
        setResult({ status: "failed", message });
      }
    } catch (err) {
      console.error(err);
      setResult({ status: status === "success" ? "success" : "failed", orderNumber, message });
    } finally {
      setStep("result");
    }
  };

  const resetFlow = () => {
    setForm(initialForm);
    setCheckoutHtml(null);
    setSessionToken(null);
    setResult(null);
    setStep("form");
  };

  return (
    <div className="bg-[#FDFCFB] py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 lg:flex-row">
        <div className="flex-1 rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-serif font-light text-brand-brown">
            {language === "tr" ? "Ödeme" : "Checkout"}
          </h1>

          {step === "form" && (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-brand-brown/80">
                    {language === "tr" ? "Ad Soyad" : "Full Name"}
                  </label>
                  <input
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-4 py-3 text-sm outline-none focus:border-warm-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-brown/80">E-mail</label>
                  <input
                    name="customerEmail"
                    type="email"
                    value={form.customerEmail}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-4 py-3 text-sm outline-none focus:border-warm-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-brown/80">
                    {language === "tr" ? "Telefon (5xx xxx xx xx)" : "Phone (5xx xxx xx xx)"}
                  </label>
                  <input
                    name="customerPhone"
                    value={form.customerPhone}
                    onChange={handleChange}
                    required
                    placeholder="5xx xxx xx xx"
                    className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-4 py-3 text-sm outline-none focus:border-warm-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-brand-brown/80">
                  {language === "tr" ? "Teslimat Adresi" : "Shipping Address"}
                </label>
                <textarea
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-4 py-3 text-sm outline-none focus:border-warm-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-brand-brown/80">
                  {language === "tr" ? "Notlar" : "Notes"}
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-4 py-3 text-sm outline-none focus:border-warm-500"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={!items.length || loading}
                className="w-full rounded-full bg-warm-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-warm-600 disabled:cursor-not-allowed disabled:bg-warm-300"
              >
                {loading
                  ? language === "tr"
                    ? "İşleniyor..."
                    : "Processing..."
                  : language === "tr"
                  ? "Ödemeye Geç"
                  : "Proceed to Payment"}
              </button>
            </form>
          )}

          {step === "payment" && (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-brand-brown/70">
                {language === "tr"
                  ? "Ödeme formu yükleniyor. Lütfen işleminizi tamamlayın."
                  : "The payment form is loading. Please complete your transaction."}
              </p>
              {checkoutHtml && (
                <div
                  className="overflow-hidden rounded-3xl border border-brand-tan bg-brand-beige p-4"
                  dangerouslySetInnerHTML={{ __html: checkoutHtml }}
                />
              )}
              <button
                type="button"
                onClick={resetFlow}
                className="rounded-full border border-warm-500 px-6 py-2 text-sm font-medium text-warm-600 transition hover:bg-warm-100"
              >
                {language === "tr" ? "Bilgileri Düzenle" : "Edit Information"}
              </button>
            </div>
          )}

          {step === "result" && result && (
            <div className="mt-8 space-y-4 rounded-3xl bg-brand-tan/60 p-6 text-brand-brown">
              <h2 className="text-xl font-serif">
                {result.status === "success"
                  ? language === "tr"
                    ? "Teşekkürler!"
                    : "Thank you!"
                  : language === "tr"
                  ? "Ödeme Tamamlanamadı"
                  : "Payment Failed"}
              </h2>
              {result.status === "success" ? (
                <>
                  <p className="text-sm">
                    {language === "tr"
                      ? `Siparişiniz başarıyla alındı. Sipariş Numaranız: ${result.orderNumber ?? "-"}`
                      : `Your payment was confirmed. Order Number: ${result.orderNumber ?? "-"}`}
                  </p>
                  <p className="text-sm text-brand-brown/70">
                    {language === "tr"
                      ? "Sipariş detaylarını e-posta adresinizde bulabilirsiniz."
                      : "You'll receive the order details via email."}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-red-500">
                    {result.message ||
                      (language === "tr"
                        ? "Ödeme onayı alınamadı. Lütfen tekrar deneyin veya farklı bir kart kullanın."
                        : "Payment could not be confirmed. Please try again or use a different card.")}
                  </p>
                  <button
                    type="button"
                    onClick={resetFlow}
                    className="rounded-full border border-warm-500 px-6 py-2 text-sm font-medium text-warm-600 transition hover:bg-warm-100"
                  >
                    {language === "tr" ? "Tekrar Dene" : "Try Again"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <aside className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-serif font-light text-brand-brown">
            {language === "tr" ? "Sipariş Özeti" : "Order Summary"}
          </h2>
          <div className="mt-6 space-y-4 text-sm text-brand-brown/70">
            {summaryItems.length === 0 ? (
              <p>{language === "tr" ? "Sepetiniz boş." : "Your cart is empty."}</p>
            ) : (
              summaryItems.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <p className="font-medium text-brand-brown">
                      {language === "tr" ? item.product.nameTr : item.product.nameEn}
                    </p>
                    <p className="text-xs text-brand-brown/60">x{item.quantity}</p>
                  </div>
                  <p className="font-medium text-brand-brown">
                    {((item.product.price * item.quantity) / 100).toFixed(2)} TL
                  </p>
                </div>
              ))
            )}
            <div className="flex justify-between border-t border-brand-tan pt-4 text-base font-semibold text-brand-brown">
              <span>{language === "tr" ? "Toplam" : "Total"}</span>
              <span>{(summaryTotal / 100).toFixed(2)} TL</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


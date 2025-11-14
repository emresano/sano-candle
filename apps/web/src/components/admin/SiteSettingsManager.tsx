import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";

const DEFAULT_FORM = {
  contactEmail: "info@premiumcandles.com",
  instagramUrl: "",
  facebookUrl: "",
  notificationEmail: "emrekocakoglu@gmail.com",
};

export default function SiteSettingsManager() {
  const { language } = useLanguage();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      try {
        const response = await api.get("/settings");
        if (isMounted && response.data?.data) {
          setForm({ ...DEFAULT_FORM, ...response.data.data });
        }
      } catch (error) {
        console.error(error);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.put("/settings", {
        contactEmail: form.contactEmail,
        instagramUrl: form.instagramUrl,
        facebookUrl: form.facebookUrl,
        notificationEmail: form.notificationEmail,
      });
      setStatus(language === "tr" ? "Ayarlar kaydedildi." : "Settings saved.");
    } catch (error) {
      console.error(error);
      setStatus(language === "tr" ? "Ayarlar kaydedilemedi." : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-serif font-light text-brand-brown">
          {language === "tr" ? "Site Ayarları" : "Site Settings"}
        </h2>
        <p className="mt-2 text-sm text-brand-brown/70">
          {language === "tr"
            ? "Footer iletişim bilgilerini ve yeni sipariş bildirim e-postasını buradan güncelleyebilirsiniz."
            : "Update footer contact details and the notification email for new orders."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "İletişim E-postası" : "Contact Email"}
          </label>
          <input
            name="contactEmail"
            type="email"
            required
            value={form.contactEmail}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-warm-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-brand-brown/60">Instagram</label>
          <input
            name="instagramUrl"
            type="url"
            placeholder="https://instagram.com/..."
            value={form.instagramUrl}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-warm-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-brand-brown/60">Facebook</label>
          <input
            name="facebookUrl"
            type="url"
            placeholder="https://facebook.com/..."
            value={form.facebookUrl}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-warm-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "Sipariş Bildirim E-postası" : "Order Notification Email"}
          </label>
          <input
            name="notificationEmail"
            type="email"
            required
            value={form.notificationEmail}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-warm-500"
          />
          <p className="mt-2 text-xs text-brand-brown/60">
            {language === "tr"
              ? "Yeni siparişler ve ödeme durum bildirimleri bu adrese gönderilecektir."
              : "Payment confirmations and order alerts will be sent to this address."}
          </p>
        </div>

        {status && (
          <p className="md:col-span-2 text-sm text-brand-accent">{status}</p>
        )}

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-warm-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-warm-600 disabled:cursor-not-allowed disabled:bg-warm-300"
          >
            {saving
              ? language === "tr"
                ? "Kaydediliyor..."
                : "Saving..."
              : language === "tr"
              ? "Ayarları Kaydet"
              : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

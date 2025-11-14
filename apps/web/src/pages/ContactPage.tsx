import { FormEvent, useState } from "react";
import api from "../lib/api";
import { useLanguage } from "../context/LanguageContext";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactPage() {
  const { language } = useLanguage();
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await api.post("/marketing/contact", form);
      setStatus(language === "tr" ? "Mesajınız alındı." : "Your message has been received.");
      setForm(initialState);
    } catch (error) {
      console.error(error);
      setStatus(language === "tr" ? "Mesaj gönderilemedi." : "Message could not be sent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDFCFB] py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 md:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-4xl font-serif font-light text-brand-brown">
            {language === "tr" ? "Bize Ulaşın" : "Contact Us"}
          </h1>
          <p className="text-base leading-relaxed text-brand-brown/70">
            {language === "tr"
              ? "Sorularınız, işbirliği talepleriniz veya özel siparişleriniz için bizimle iletişime geçebilirsiniz."
              : "Get in touch with us for questions, collaborations or bespoke orders."}
          </p>

          <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-brand-brown">E-posta</h3>
              <p className="text-sm text-brand-brown/70">info@sanocandle.com</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-brown">
                {language === "tr" ? "Telefon" : "Phone"}
              </h3>
              <p className="text-sm text-brand-brown/70">+90 (532) 548 56 80</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-brown">
                {language === "tr" ? "Adres" : "Address"}
              </h3>
              <p className="text-sm text-brand-brown/70">Türkiye</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-brand-brown/80">
                {language === "tr" ? "Adınız" : "Your Name"}
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-4 py-3 text-sm outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-brown/80">E-mail</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-4 py-3 text-sm outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-brown/80">
                {language === "tr" ? "Telefon" : "Phone"}
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-4 py-3 text-sm outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-brown/80">
                {language === "tr" ? "Mesajınız" : "Your Message"}
              </label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-4 py-3 text-sm outline-none focus:border-brand-accent"
              />
            </div>

            {status && <p className="text-sm text-brand-accent">{status}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-warm-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-warm-600 disabled:cursor-not-allowed disabled:bg-warm-300"
            >
              {loading
                ? language === "tr"
                  ? "Gönderiliyor..."
                  : "Sending..."
                : language === "tr"
                ? "Mesajı Gönder"
                : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


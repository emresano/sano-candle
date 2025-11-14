import { useEffect, useState } from "react";
import { Facebook, Instagram, Mail } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import api from "../lib/api";

type FooterSettings = {
  contactEmail: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
};

const DEFAULT_SETTINGS: FooterSettings = {
  contactEmail: "info@premiumcandles.com",
  instagramUrl: "",
  facebookUrl: "",
};

export default function Footer() {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<FooterSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      try {
        const response = await api.get("/settings");
        if (isMounted && response.data?.data) {
          setSettings({ ...DEFAULT_SETTINGS, ...response.data.data });
        }
      } catch (error) {
        console.error(error);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const instagramLink = settings.instagramUrl && settings.instagramUrl.trim() !== "" ? settings.instagramUrl : undefined;
  const facebookLink = settings.facebookUrl && settings.facebookUrl.trim() !== "" ? settings.facebookUrl : undefined;

  return (
    <footer className="bg-sand-100 text-brand-brown">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-serif font-medium text-brand-brown">Premium Candles</h3>
          <p className="mt-4 text-sm text-brand-brown/70">
            {language === "tr" ? "Doğal ve sürdürülebilir el yapımı mumlar" : "Natural and sustainable handmade candles"}
          </p>
        </div>

        <div>
          <h4 className="text-lg font-serif font-medium text-brand-brown">
            {language === "tr" ? "İletişim" : "Contact"}
          </h4>
          <p className="mt-4 text-sm text-brand-brown/70">
            E-posta: <a className="font-medium text-warm-600 underline-offset-2 hover:underline" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
            <br />
            {language === "tr" ? "Telefon" : "Phone"}: +90 (555) 123 45 67
          </p>
        </div>

        <div>
          <h4 className="text-lg font-serif font-medium text-brand-brown">
            {language === "tr" ? "Bizi Takip Edin" : "Follow Us"}
          </h4>
          <div className="mt-4 flex gap-4 text-brand-brown/70">
            <a
              href={instagramLink ?? "#"}
              target={instagramLink ? "_blank" : undefined}
              rel={instagramLink ? "noopener noreferrer" : undefined}
              className="transition hover:text-warm-600"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a
              href={facebookLink ?? "#"}
              target={facebookLink ? "_blank" : undefined}
              rel={facebookLink ? "noopener noreferrer" : undefined}
              className="transition hover:text-warm-600"
              aria-label="Facebook"
            >
              <Facebook size={24} />
            </a>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="transition hover:text-warm-600"
              aria-label="E-posta"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-sand-200 py-6 text-center text-sm text-brand-brown/70">
        © {new Date().getFullYear()} Premium Candles. {language === "tr" ? "Tüm hakları saklıdır." : "All rights reserved."}
      </div>
    </footer>
  );
}


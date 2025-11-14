import { createContext, useContext, useMemo, useState } from "react";

type Language = "tr" | "en";

type Dictionary = Record<string, { tr: string; en: string }>;

const dictionary: Dictionary = {
  heroSubtitle: {
    tr: "Yeni Koleksiyon",
    en: "New Collection",
  },
  heroTitle: {
    tr: "Sıcaklığın Zarafeti",
    en: "The Elegance of Warmth",
  },
  heroDescription: {
    tr: "El yapımı, doğal mumlarla evinize huzur ve sıcaklık katın",
    en: "Bring peace and warmth to your home with handmade, natural candles",
  },
  shopNow: {
    tr: "Alışverişe Başla",
    en: "Shop Now",
  },
  ourStoryTitle: {
    tr: "Hikayemiz",
    en: "Our Story",
  },
  ourStoryBody: {
    tr: "Premium Candles, doğal ve sürdürülebilir malzemelerle üretilen el yapımı mumların öncüsüdür. Her bir mum, %80 soya wax, %15 coco wax ve %5 balmumu karışımıyla özenle hazırlanır. Evinize sadece koku değil, bir yaşam tarzı sunuyoruz.",
    en: "Premium Candles is a pioneer of handmade candles crafted with natural and sustainable materials. Each candle is carefully prepared with a blend of 80% soy wax, 15% coco wax and 5% beeswax. We offer not just a scent, but a lifestyle for your home.",
  },
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof dictionary) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("tr");

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((prev) => (prev === "tr" ? "en" : "tr")),
      t: (key) => dictionary[key][language],
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}


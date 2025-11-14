import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const values = [
  {
    titleTr: "Doğal",
    titleEn: "Natural",
    descriptionTr: "%100 doğal soya mumu ve organik kokular kullanıyoruz.",
    descriptionEn: "We use 100% natural soy wax and organic fragrances.",
  },
  {
    titleTr: "Sürdürülebilir",
    titleEn: "Sustainable",
    descriptionTr: "Çevreye duyarlı üretim yöntemleri benimsiyoruz.",
    descriptionEn: "We embrace eco-conscious production methods.",
  },
  {
    titleTr: "El Yapımı",
    titleEn: "Handcrafted",
    descriptionTr: "Her mum özenle el yapımıdır ve küçük partiler halinde üretilir.",
    descriptionEn: "Each candle is handmade in small batches with care.",
  },
];

export default function AboutPage() {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-brand-tan/40 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 lg:flex-row">
        <div className="flex-1 rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-serif font-light text-brand-brown">
            {language === "tr" ? "Hikayemiz" : "Our Story"}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-brand-brown/75">
            {language === "tr"
              ? "Premium Candles, 2020 yılında doğal ve sürdürülebilir mum üretme tutkusu ile kuruldu. Her bir mumumuz, %80 soya wax, %15 coco wax ve %5 balmumu karışımıyla özenle el yapımıdır. Misyonumuz evinize sadece koku değil, bir yaşam tarzı sunmaktır."
              : "Premium Candles was founded in 2020 with a passion for crafting natural and sustainable candles. Each candle is handmade with a blend of 80% soy wax, 15% coco wax and 5% beeswax. Our mission is to bring more than a scent – a lifestyle – into your home."}
          </p>
          <p className="mt-4 text-base leading-relaxed text-brand-brown/75">
            {language === "tr"
              ? "Doğaya saygılı, sağlıklı ve estetik ürünler üretmeye devam ediyoruz. Küçük atölyemizde modern yaşam tarzıyla uyumlu şık ve minimalist tasarımlar yaratıyoruz."
              : "We remain committed to creating sustainable, healthy and aesthetic products. From our atelier we design chic, minimalist pieces that complement contemporary living."}
          </p>
        </div>

        <div className="flex-1 overflow-hidden rounded-3xl bg-white shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?w=1200&auto=format&fit=crop"
            alt="Our studio"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.titleTr} className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-serif font-medium text-brand-brown">
                {language === "tr" ? value.titleTr : value.titleEn}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-brown/70">
                {language === "tr" ? value.descriptionTr : value.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


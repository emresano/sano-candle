import { useEffect, useMemo, useState } from "react";
import { Leaf, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { Collection, Product } from "../types";
import { useLanguage } from "../context/LanguageContext";
import Modal from "../components/Modal";

type Feature = {
  id: string;
  titleTr: string;
  titleEn: string;
  shortTr: string;
  shortEn: string;
  longTr: string;
  longEn: string;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    id: "nature",
    titleTr: "Doğaya Saygılıyız",
    titleEn: "Respectful to Nature",
    shortTr: "%100 doğal soya mumu ve organik kokularla üretilir",
    shortEn: "Made with 100% natural soy wax and organic fragrances",
    longTr:
      "Tüm mumlarımız %100 doğal soya mumu ile üretilir. Organik kokular kullanarak çevreye ve sağlığınıza saygı gösteririz. Sürdürülebilir yöntemlerimizle doğayı korumayı amaçlıyoruz.",
    longEn:
      "All our candles are made with 100% natural soy wax. We respect the environment and your health by using organic fragrances. Our sustainable methods aim to protect nature.",
    icon: <Leaf className="h-12 w-12" />,
  },
  {
    id: "handmade",
    titleTr: "El Yapımı Üretim",
    titleEn: "Handmade Production",
    shortTr: "Her mum özenle el yapımıdır ve küçük partiler halinde üretilir",
    shortEn: "Each candle is carefully handmade and produced in small batches",
    longTr:
      "Ustalarımız her bir mumu tek tek hazırlar. Küçük partiler halinde üretim yaparak kaliteden ödün vermeyiz. Her mum sevgi ve özenle hazırlanır.",
    longEn:
      "Our artisans craft each candle by hand. Small batch production ensures uncompromised quality. Every candle is prepared with love and care.",
    icon: <Heart className="h-12 w-12" />,
  },
  {
    id: "healthy",
    titleTr: "Neden Sağlıklıyız",
    titleEn: "Why We Are Healthy",
    shortTr: "Toksik madde içermez, temiz yanar ve uzun ömürlüdür",
    shortEn: "Contains no toxins, burns cleanly and lasts long",
    longTr:
      "Mumlarımız parafin, kurşun veya toksik maddeler içermez. Temiz yanar ve hava kalitesini bozmaz. Uzun yanma süresi ile ekonomiktir.",
    longEn:
      "Our candles contain no paraffin, lead or toxins. They burn cleanly without affecting air quality and their long burn time is economical.",
    icon: <Sparkles className="h-12 w-12" />,
  },
];

export default function HomePage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState("");
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectionsRes, featuredRes] = await Promise.all([
          api.get("/catalog/collections"),
          api.get("/catalog/products/featured"),
        ]);
        setCollections(collectionsRes.data.data ?? []);
        setFeaturedProducts(featuredRes.data.data ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    void fetchData();
  }, []);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.post("/marketing/newsletter/subscribe", { email });
      if (response.data.data?.created) {
        setNewsletterStatus(language === "tr" ? "Bültene başarıyla abone oldunuz!" : "Successfully subscribed!");
      } else {
        setNewsletterStatus(language === "tr" ? "Zaten abonesiniz." : "You are already subscribed.");
      }
      setEmail("");
    } catch (error) {
      console.error(error);
      setNewsletterStatus(language === "tr" ? "Bir hata oluştu." : "Something went wrong.");
    }
  };

  const selectedFeature = useMemo(
    () => features.find((feature) => feature.id === selectedFeatureId),
    [selectedFeatureId]
  );

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="grid h-full grid-cols-1 md:grid-cols-2">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200&auto=format&fit=crop"
              alt="Candle"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4C4B0]/80 via-transparent to-[#A89080]/90" />
          </div>
          <div className="relative flex items-center justify-center bg-[#FDFCFB] p-12">
            <div className="absolute inset-0 opacity-10">
              <img
                src="https://images.unsplash.com/photo-1604762524889-4b6f0d4c3c3f?w=1200&auto=format&fit=crop"
                alt="Background"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative max-w-md text-center">
              <p className="text-sm font-serif italic text-brand-accent">{t("heroSubtitle")}</p>
              <h1 className="mt-4 text-5xl font-serif font-light text-brand-brown md:text-6xl">
                {t("heroTitle")}
              </h1>
              <p className="mt-6 text-base text-brand-brown/70">{t("heroDescription")}</p>
              <button
                onClick={() => navigate("/shop")}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-warm-500 px-8 py-4 text-base font-medium text-white transition hover:bg-warm-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-600"
              >
                {t("shopNow")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-[#FDFCFB] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-serif font-light text-brand-brown">{t("ourStoryTitle")}</h2>
          <p className="mt-6 text-lg leading-relaxed text-brand-brown/75">{t("ourStoryBody")}</p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-brand-tan py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group cursor-pointer rounded-2xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              onClick={() => setSelectedFeatureId(feature.id)}
            >
              <div className="flex justify-center text-brand-accent group-hover:text-[#6B5845]">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-serif font-medium text-brand-brown">
                {language === "tr" ? feature.titleTr : feature.titleEn}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-brand-brown/70">
                {language === "tr" ? feature.shortTr : feature.shortEn}
              </p>
              <button className="mt-6 inline-flex items-center justify-center rounded-full border border-brand-accent px-4 py-2 text-sm font-medium text-brand-accent transition group-hover:bg-brand-accent group-hover:text-white">
                {language === "tr" ? "Devamını Oku" : "Read More"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <Modal
        open={Boolean(selectedFeature)}
        title={language === "tr" ? selectedFeature?.titleTr ?? "" : selectedFeature?.titleEn ?? ""}
        onClose={() => setSelectedFeatureId(null)}
      >
        {language === "tr" ? selectedFeature?.longTr : selectedFeature?.longEn}
      </Modal>

      {/* Collections */}
      <section className="bg-[#FDFCFB] py-20" id="collections">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <p className="text-sm font-serif italic text-brand-accent">
              {language === "tr" ? "Koleksiyonlarımız" : "Our Collections"}
            </p>
            <h2 className="mt-3 text-4xl font-serif font-light text-brand-brown">
              {language === "tr" ? "Koleksiyonlara Göz Atın" : "Shop by Collection"}
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => navigate(`/shop?collection=${collection.slug}`)}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-[#D4C4B0] to-[#A89080] text-left"
              >
                <img
                  src={
                    collection.imageUrl ??
                    "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop"
                  }
                  alt={collection.nameTr}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <h3 className="text-3xl font-serif font-light">
                    {language === "tr" ? collection.nameTr : collection.nameEn}
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    {language === "tr" ? collection.descriptionTr : collection.descriptionEn}
                  </p>
                  <span className="mt-4 inline-flex items-center rounded-full border border-white px-4 py-2 text-sm font-medium text-white transition group-hover:bg-white group-hover:text-brand-brown">
                    {language === "tr" ? "Keşfet" : "Explore"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-brand-tan py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="text-sm font-serif italic text-brand-accent">
              {language === "tr" ? "Öne Çıkanlar" : "Featured"}
            </p>
            <h2 className="mt-3 text-4xl font-serif font-light text-brand-brown">
              {language === "tr" ? "Öne Çıkan Ürünler" : "Featured Products"}
            </h2>
          </div>

          {loadingFeatured ? (
            <div className="mt-12 flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-accent/40 border-t-brand-accent" />
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => navigate(`/product/${product.slug}`)}
                  className="group overflow-hidden rounded-2xl bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-square overflow-hidden bg-[#F8F7F3]">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={language === "tr" ? product.nameTr : product.nameEn}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-brand-brown/60">
                        {language === "tr" ? "Görsel Yok" : "No Image"}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-medium text-brand-brown group-hover:text-brand-accent">
                      {language === "tr" ? product.nameTr : product.nameEn}
                    </h3>
                    <p className="mt-2 text-lg font-semibold text-brand-accent">
                      {(product.price / 100).toFixed(2)} TL
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#FDFCFB] py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-serif font-light text-brand-brown">
            {language === "tr" ? "E-posta Bülteni" : "Newsletter"}
          </h2>
          <p className="mt-4 text-base text-brand-brown/75">
            {language === "tr"
              ? "Yeni ürünler ve özel tekliflerden haberdar olun"
              : "Stay informed about new products and special offers"}
          </p>
          <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col gap-4 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={language === "tr" ? "E-posta adresiniz" : "Your email address"}
              className="flex-1 rounded-full border border-brand-tan bg-white px-5 py-3 text-sm outline-none transition focus:border-brand-accent"
            />
            <button
              type="submit"
              className="rounded-full bg-warm-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-warm-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-600"
            >
              {language === "tr" ? "Abone Ol" : "Subscribe"}
            </button>
          </form>
          {newsletterStatus && <p className="mt-4 text-sm text-brand-accent">{newsletterStatus}</p>}
        </div>
      </section>
    </div>
  );
}


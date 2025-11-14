import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../lib/api";
import { Collection, Product } from "../types";
import { useLanguage } from "../context/LanguageContext";

export default function ShopPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const collectionSlug = searchParams.get("collection") ?? undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [collectionsRes, productsRes] = await Promise.all([
          api.get("/catalog/collections"),
          api.get("/catalog/products", {
            params: collectionSlug ? { collectionSlug } : undefined,
          }),
        ]);
        setCollections(collectionsRes.data.data ?? []);
        setProducts(productsRes.data.data ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [collectionSlug]);

  const selectedCollection = useMemo(
    () => collections.find((collection) => collection.slug === collectionSlug),
    [collections, collectionSlug]
  );

  return (
    <div className="bg-[#FDFCFB]">
      <section className="bg-brand-tan/60 py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
          <h1 className="text-4xl font-serif font-light text-brand-brown">
            {selectedCollection
              ? language === "tr"
                ? selectedCollection.nameTr
                : selectedCollection.nameEn
              : language === "tr"
              ? "Koleksiyonlarımız"
              : "Our Collections"}
          </h1>
          <p className="max-w-3xl text-base text-brand-brown/70">
            {selectedCollection
              ? language === "tr"
                ? selectedCollection.descriptionTr
                : selectedCollection.descriptionEn
              : language === "tr"
              ? "Sadeliğin zarafeti ile lüks dokunuşları keşfedin. Koleksiyonlarımız evinize huzur, sıcaklık ve stil katmak için tasarlandı."
              : "Discover the elegance of simplicity and the charm of luxury. Our collections are crafted to bring warmth, serenity and style into your home."}
          </p>
        </div>
      </section>

      {!collectionSlug && collections.length > 0 && (
        <section className="py-16">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => navigate(`/shop?collection=${collection.slug}`)}
                className="group relative h-[260px] overflow-hidden rounded-2xl bg-gradient-to-br from-sand-300 via-warm-200 to-warm-400 text-left"
              >
                <img
                  src={
                    collection.imageUrl ??
                    "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200&auto=format&fit=crop"
                  }
                  alt={collection.nameTr}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-8 text-white">
                  <h2 className="text-3xl font-serif font-light">
                    {language === "tr" ? collection.nameTr : collection.nameEn}
                  </h2>
                  <p className="mt-3 text-sm text-white/80">
                    {language === "tr" ? collection.descriptionTr : collection.descriptionEn}
                  </p>
                  <span className="mt-6 inline-flex w-max items-center rounded-full border border-white px-4 py-2 text-sm font-medium text-white transition group-hover:bg-white group-hover:text-brand-brown">
                    {language === "tr" ? "Keşfet" : "Discover"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-serif font-light text-brand-brown">
              {selectedCollection
                ? language === "tr"
                  ? `${selectedCollection.nameTr} Ürünleri`
                  : `${selectedCollection.nameEn} Products`
                : language === "tr"
                ? "Tüm Ürünler"
                : "All Products"}
            </h2>
            {collectionSlug && (
              <button
                onClick={() => navigate("/shop")}
                className="text-sm font-medium text-brand-accent transition hover:underline"
              >
                {language === "tr" ? "Tümünü Göster" : "Show All"}
              </button>
            )}
          </div>

          {loading ? (
            <div className="mt-16 flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-accent/40 border-t-brand-accent" />
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => navigate(`/product/${product.slug}`)}
                  className="group overflow-hidden rounded-2xl bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-square overflow-hidden bg-brand-beige">
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
                    <p className="mt-2 text-sm text-brand-brown/70 line-clamp-2">
                      {language === "tr" ? product.descriptionTr : product.descriptionEn}
                    </p>
                    <p className="mt-4 text-lg font-semibold text-brand-accent">
                      {(product.price / 100).toFixed(2)} TL
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import { Product } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const { language } = useLanguage();
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await api.get(`/catalog/products/slug/${slug}`);
        setProduct(response.data.data ?? null);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setStatus(language === "tr" ? "Ürün sepetinize eklendi." : "Product added to cart.");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FDFCFB]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-accent/40 border-t-brand-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#FDFCFB] py-20 text-center">
        <h1 className="text-3xl font-serif text-brand-brown">
          {language === "tr" ? "Ürün bulunamadı" : "Product not found"}
        </h1>
        <button
          onClick={() => navigate("/shop")}
          className="mt-6 inline-flex items-center rounded-full bg-warm-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-warm-600"
        >
          {language === "tr" ? "Mağazaya Dön" : "Back to Shop"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCFB] py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 lg:flex-row">
        <div className="flex-1">
          <div className="overflow-hidden rounded-3xl bg-brand-beige shadow">
            <img
              src={product.imageUrl ?? "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1200&auto=format&fit=crop"}
              alt={language === "tr" ? product.nameTr : product.nameEn}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-4xl font-serif font-light text-brand-brown">
              {language === "tr" ? product.nameTr : product.nameEn}
            </h1>
            <p className="mt-2 text-lg font-medium text-brand-accent">
              {(product.price / 100).toFixed(2)} TL
            </p>
          </div>

          <div className="space-y-3 text-brand-brown/80">
            <h2 className="font-serif text-xl text-brand-brown">
              {language === "tr" ? "Açıklama" : "Description"}
            </h2>
            <p>{language === "tr" ? product.descriptionTr : product.descriptionEn}</p>
            {product.compositionTr && (
              <p className="text-sm text-brand-brown/70">
                <strong>{language === "tr" ? "İçerik" : "Composition"}:</strong> {language === "tr" ? product.compositionTr : product.compositionEn}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center rounded-full border border-brand-tan bg-white">
              <button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                className="rounded-l-full p-3 text-brand-brown transition hover:bg-brand-tan/60"
              >
                <Minus size={16} />
              </button>
              <span className="px-6 text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => Math.min(prev + 1, 99))}
                className="rounded-r-full p-3 text-brand-brown transition hover:bg-brand-tan/60"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="rounded-full bg-warm-500 px-8 py-3 text-sm font-medium text-white transition hover:bg-warm-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-600"
            >
              {language === "tr" ? "Sepete Ekle" : "Add to Cart"}
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                navigate("/checkout");
              }}
              className="rounded-full border border-warm-500 px-8 py-3 text-sm font-medium text-warm-600 transition hover:bg-warm-100 hover:text-warm-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-600"
            >
              {language === "tr" ? "Hemen Satın Al" : "Buy Now"}
            </button>
          </div>

          {status && <p className="text-sm text-brand-accent">{status}</p>}

          {product.storyTr && (
            <div className="rounded-3xl bg-brand-tan/60 p-6">
              <h3 className="font-serif text-xl text-brand-brown">
                {language === "tr" ? "Koku Hikayesi" : "Scent Story"}
              </h3>
              <p className="mt-3 text-brand-brown/80">
                {language === "tr" ? product.storyTr : product.storyEn}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-brand-beige px-4 text-center">
      <h1 className="text-5xl font-serif font-light text-brand-brown">404</h1>
      <p className="mt-4 text-lg text-brand-brown/70">
        {language === "tr" ? "Aradığınız sayfa bulunamadı." : "The page you are looking for could not be found."}
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 rounded-full bg-warm-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-warm-600"
      >
        {language === "tr" ? "Ana Sayfaya Dön" : "Go Home"}
      </button>
    </div>
  );
}


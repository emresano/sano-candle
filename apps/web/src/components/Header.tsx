import { Link, useLocation } from "react-router-dom";
import { Globe, ShoppingCart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import clsx from "clsx";

const navLinks = [
  { path: "/shop", slug: "sanostudio", labelTr: "Sano Studio", labelEn: "Minimal Collection" },
  { path: "/shop", slug: "sanoluxury", labelTr: "Sano Luxury", labelEn: "Luxury Collection" },
  { path: "/about", labelTr: "Hakkımızda", labelEn: "About Us" },
  { path: "/contact", labelTr: "Bize Ulaşın", labelEn: "Contact Us" },
];

export default function Header() {
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeCollection = params.get("collection");
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[#FDFCFB]/95 backdrop-blur border-b border-brand-tan">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-5xl font-serif font-bold text-[#5C4738]">
          SANO
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const to = link.slug ? `${link.path}?collection=${link.slug}` : link.path;
            const isActive = link.slug
              ? location.pathname === link.path && activeCollection === link.slug
              : location.pathname === link.path;

            return (
              <Link
                key={to}
                to={to}
                className={clsx(
                  "text-lg md:text-lg font-semibold tracking-wide transition-colors",
                  isActive ? "text-warm-600" : "text-brand-brown hover:text-warm-600"
                )}
              >
                {language === "tr" ? link.labelTr : link.labelEn}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-tan/60"
            aria-label="Dil Değiştir / Change language"
          >
            <Globe size={16} />
            {language.toUpperCase()}
          </button>
          <Link to="/cart" className="relative rounded-full p-2 text-brand-brown transition hover:bg-brand-tan/60" aria-label={language === "tr" ? "Sepeti aç" : "Open cart"}>
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-full bg-warm-500 px-1 text-xs font-semibold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}


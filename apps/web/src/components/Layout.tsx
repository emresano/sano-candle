import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-beige text-brand-brown">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}


import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Намылимся. — Лента",
  description: "Площадка для живых встреч",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-theme="light">
      <body>
        <header className="sticky top-0 z-10 bg-brand-bg border-b-2 border-brand-line">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-3">
            <div className="font-extrabold text-2xl tracking-tighter uppercase">
              Намылимся<span className="text-brand-accent">.</span>
            </div>
            <nav className="hidden md:flex gap-2">
              <button className="font-bold text-sm uppercase tracking-wider text-brand-accent">[ Лента ]</button>
              <button className="font-bold text-sm uppercase tracking-wider hover:text-brand-accent transition-colors">Мои заявки</button>
              <button className="font-bold text-sm uppercase tracking-wider hover:text-brand-accent transition-colors">Архив</button>
            </nav>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center border-2 border-brand-line rounded-brand bg-brand-surface">🌙</button>
              <button className="bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-4 py-2 border-2 border-brand-line rounded-brand">
                Войти
              </button>
            </div>
          </div>
        </header>

        {children}

        <footer className="max-w-[1280px] mx-auto mt-10 px-6 py-5 text-brand-muted text-[13px] border-t-2 border-brand-line">
          <p>«Намылимся.» — площадка для живых встреч. Ответственность за проведение событий лежат на организаторах и участниках.</p>
          <p>16+ · Правила сообщества · Поддержка</p>
        </footer>
      </body>
    </html>
  );
}
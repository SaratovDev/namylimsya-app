import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition"; // <-- ИМПОРТ

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
      <body className="min-h-screen flex flex-col"> {/* Добавили flex для прижатия футера */}
        <Header />
        
        {/* Оборачиваем в анимированный компонент */}
        <PageTransition>
          {children}
        </PageTransition>

        <footer className="max-w-[1280px] w-full mx-auto mt-auto px-6 py-5 text-brand-muted text-[13px] border-t-2 border-brand-line">
          <p>«Намылимся.» — площадка для живых встреч. Ответственность за проведение событий лежат на организаторах и участниках.</p>
          <p>16+ · Правила сообщества · Поддержка</p>
        </footer>
      </body>
    </html>
  );
}
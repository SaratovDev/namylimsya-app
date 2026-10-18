import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

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
        
        <Header />

        {children}

        <footer className="max-w-[1280px] mx-auto mt-10 px-6 py-5 text-brand-muted text-[13px] border-t-2 border-brand-line">
          <p>«Намылимся.» — площадка для живых встреч. Ответственность за проведение событий лежат на организаторах и участниках.</p>
          <p>16+ · Правила сообщества · Поддержка</p>
        </footer>
      </body>
    </html>
  );
}
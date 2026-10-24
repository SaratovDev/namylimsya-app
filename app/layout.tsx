import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { ToastProvider } from "@/components/Toast";
import Link from 'next/link';

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
    <html lang="ru" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Скрипт для мгновенного применения темы до рендера (чтобы не было вспышки) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
        <Header />
        
        <PageTransition>
          {children}
        </PageTransition>

          <footer className="max-w-[1100px] w-full mx-auto mt-auto px-6 py-5 text-brand-muted text-[13px] border-t-2 border-brand-line flex justify-between items-center">
          <div>
            <p>«Намылимся.» — площадка для живых встреч. Ответственность за проведение событий лежат на организаторах и участниках.</p>
            <p>16+ · Правила сообщества · <Link href="/support" className="hover:text-brand-accent transition-colors">Написать в поддержку</Link></p>
          </div>
        </footer>

        </ToastProvider>
      </body>
    </html>
  );
}
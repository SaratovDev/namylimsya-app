'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Логируем ошибку в консоль (в будущем сюда можно подключить Sentry)
    console.error('Глобальная ошибка приложения:', error);
  }, [error]);

  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8 text-center">
        <div className="text-5xl mb-4">💥</div>
        <h1 className="text-2xl font-extrabold uppercase mb-4">
          Что-то пошло не так
        </h1>
        <p className="text-brand-muted font-bold mb-6">
          Произошла непредвиденная ошибка. Мы уже работаем над этим. Попробуйте обновить страницу.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors"
          >
            Попробовать снова
          </button>
          <Link
            href="/"
            className="bg-brand-bg text-brand-text font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-surface transition-colors"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </main>
  );
}
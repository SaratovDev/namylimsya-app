import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8 text-center">
        <h1 className="text-6xl font-extrabold text-brand-accent mb-2">404</h1>
        <h2 className="text-xl font-extrabold uppercase mb-4">
          Страница не найдена
        </h2>
        <p className="text-brand-muted font-bold mb-6">
          Возможно, событие было удалено или ссылка неверна.
        </p>
        <Link
          href="/"
          className="inline-block bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors"
        >
          Вернуться в ленту
        </Link>
      </div>
    </main>
  );
}
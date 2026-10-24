import Link from 'next/link';
import AppealForm from '@/components/AppealForm';

export default function BannedPage() {
  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <div className="bg-brand-surface border-2 border-red-500 rounded-brand-lg p-8 text-center">
        <div className="text-6xl mb-4">🍆</div>
        <h1 className="text-2xl font-extrabold uppercase mb-4 text-red-600">
          Аккаунт заблокирован
        </h1>
        <p className="text-brand-muted font-bold mb-6">
          Ваш доступ к платформе «Намылимся» был приостановлен администрацией за нарушение правил сообщества.
        </p>
        <p className="text-sm font-medium text-brand-text mb-8 bg-brand-bg p-3 rounded border border-brand-line">
          Если вы считаете, что это ошибка, напишите нам. Мы обязательно разберемся.
        </p>
        
        <div className="flex flex-col gap-3">
          <AppealForm />
          <Link
            href="/login"
            className="inline-block bg-brand-bg text-brand-text font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-surface transition-colors"
          >
            Выйти из аккаунта
          </Link>
        </div>
      </div>
    </main>
  );
}


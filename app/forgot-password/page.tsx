'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      showSuccess('Письмо для сброса пароля отправлено на вашу почту!');
      setEmail('');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8">
        <h1 className="text-2xl font-extrabold uppercase mb-6 text-center">
          Сброс пароля
        </h1>
        <p className="text-sm text-brand-muted font-bold text-center mb-6">
          Введите email, привязанный к аккаунту. Мы отправим ссылку для создания нового пароля.
        </p>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="your@email.com"
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
          >
            {loading ? 'Отправка...' : 'Отправить ссылку'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-bold text-brand-muted hover:text-brand-accent transition-colors">
            ← Вернуться ко входу
          </Link>
        </div>
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      showError('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      showSuccess('Пароль успешно изменен! Перенаправляем...');
      setTimeout(() => router.push('/'), 1500); // Ждем 1.5 сек, чтобы человек прочитал, и редиректим
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Ошибка смены пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8">
        <h1 className="text-2xl font-extrabold uppercase mb-6 text-center">
          Новый пароль
        </h1>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Придумайте новый пароль</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full p-2.5 pr-10 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? (
                  // Иконка "глаз перечеркнут"
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  // Иконка "глаз"
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            <span className="text-[11px] text-brand-muted font-bold">Минимум 6 символов</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Сохранить пароль'}
          </button>
        </form>
      </div>
    </main>
  );
}
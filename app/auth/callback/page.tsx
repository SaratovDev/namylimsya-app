'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Проверяем старый метод (magic link)
    const token = searchParams.get('token');
    if (token) {
      supabase.auth.verifyOtp({ token_hash: token, type: 'magiclink' })
        .then(({ error }) => {
          if (error) alert(error.message);
          else router.push('/');
        });
      return;
    }

    // 2. Проверяем новый метод (OIDC code)
    const code = searchParams.get('code');
    if (code) {
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/telegram-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          return supabase.auth.verifyOtp({ token_hash: data.token, type: 'magiclink' });
        }
        throw new Error(data.error || 'Ошибка сервера');
      })
      .then(({ error }) => {
        if (error) alert(error.message);
        else router.push('/');
      })
      .catch(err => alert(err.message));
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center font-bold text-brand-muted">
        Авторизация... Пожалуйста, подождите.
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
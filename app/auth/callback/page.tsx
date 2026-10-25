'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function CallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    // Supabase при OAuth сам перехватывает токен из URL (в hash-части)
    // и сохраняет сессию в куки. Нам нужно просто дождаться этого.
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Ошибка авторизации:', error);
      }
      
      // В любом случае отправляем на главную. 
      // Если сессия есть, router.refresh() обновит интерфейс.
      router.push('/');
      router.refresh();
    });
  }, [router]);

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
    <Suspense fallback={<div className="text-center font-bold">Загрузка...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
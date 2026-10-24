'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Входим по хэш-токену
      supabase.auth.verifyOtp({ token_hash: token, type: 'magiclink' })
        .then(({ error }) => {
          if (error) alert(error.message);
          else router.push('/');
        });
    } else {
      // Обычный OAuth (VK/Google)
      supabase.auth.getSession().then(() => {
        router.push('/');
      });
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
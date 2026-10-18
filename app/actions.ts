'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@supabase/ssr'; // нам понадобится для серверной сессии
import { cookies } from 'next/headers';

export async function createEvent(formData: FormData) {
  const cookieStore = await cookies();
  
  // Создаем серверный клиент Supabase, чтобы узнать, кто залогинен
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabaseServer.auth.getUser();

  // Если пользователь не залогинен — выдаем ошибку
  if (!user) {
    throw new Error('Необходимо войти в аккаунт, чтобы создать событие');
  }

  // ... остальной код получения полей из формы ...
  const title = formData.get('title') as string;
  // ... (все остальные поля) ...

  // Отправляем в Supabase
  const { error } = await supabase
    .from('events')
    .insert([
      {
        title,
        // ...
        organizer_name: user.email?.split('@')[0] || 'Пользователь', // Берем имя из email
        organizer_rank: 'Инициатор',
      },
    ]);

  if (error) throw new Error('Не удалось создать событие');
  revalidatePath('/');
}
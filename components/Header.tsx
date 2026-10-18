'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null); // <-- Добавили стейт для никнейма
  const router = useRouter();

  useEffect(() => {
    // Проверяем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Слушаем изменения авторизации (вход/выход)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Как только мы узнали, что пользователь залогинен, запрашиваем его никнейм
  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          // Если никнейм нашелся - ставим его. Если нет - берем часть email до @
          setUsername(data?.username || user.email?.split('@')[0] || 'Пользователь');
        });
    } else {
      setUsername(null);
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-10 bg-brand-bg border-b-2 border-brand-line">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="font-extrabold text-2xl tracking-tighter uppercase">
          Намылимся<span className="text-brand-accent">.</span>
        </Link>
        
        <nav className="hidden md:flex gap-2">
          <Link href="/" className="font-bold text-sm uppercase tracking-wider text-brand-accent">[ Лента ]</Link>
          <button className="font-bold text-sm uppercase tracking-wider hover:text-brand-accent transition-colors">Мои заявки</button>
          <button className="font-bold text-sm uppercase tracking-wider hover:text-brand-accent transition-colors">Архив</button>
        </nav>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center border-2 border-brand-line rounded-brand bg-brand-surface">🌙</button>
          
          {user ? (
            <div className="flex items-center gap-3">
              {/* Вот тут вместо email выводим ссылку на профиль */}
              <Link 
                href={`/@${username}`} 
                className="text-sm font-bold hidden sm:block hover:text-brand-accent transition-colors"
              >
                @{username}
              </Link>
              
              <button onClick={handleLogout} className="bg-brand-surface text-brand-text font-extrabold text-sm uppercase px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-accent hover:text-white transition-colors">
                Выйти
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="bg-brand-surface text-brand-text font-extrabold text-sm uppercase px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors">
                Войти
              </Link>
              <Link href="/login?mode=register" className="bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors">
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
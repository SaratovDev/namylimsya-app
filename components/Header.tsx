'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import NotificationsBell from './NotificationsBell';



// Вспомогательный компонент для пунктов навигации ПК
function NavItem({ href, label, pathname, badgeCount }: { href: string, label: string, pathname: string, badgeCount?: number }) {
  const isActive = pathname === href;
  return (
    <Link 
      href={href} 
      className={`relative font-bold text-sm tracking-wider transition-all duration-200 flex items-center gap-1
        ${isActive ? 'text-brand-accent' : 'text-brand-text hover:text-brand-accent'}
      `}
    >
      <span className={`text-brand-accent transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>[</span>
      <span>{label}</span>
      <span className={`text-brand-accent transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>]</span>
      
      {/* Бейдж непрочитанных сообщений */}
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-brand-bg">
          {badgeCount}
        </span>
      )}
    </Link>
  );
}

export default function Header() {

  const [theme, setTheme] = useState('light');
  useEffect(() => {
    // Считываем тему из localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadChats, setUnreadChats] = useState(0); // Стейт для непрочитанных
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          setUsername(data?.username || user.email?.split('@')[0] || 'Пользователь');
        });
    } else {
      const timer = setTimeout(() => setUsername(null), 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

   // Логика подсчета непрочитанных сообщений (упрощенная для хедера)
   // Логика подсчета непрочитанных сообщений
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setUnreadChats(0), 0);
      return () => clearTimeout(timer);
    }

    const fetchUnreadCount = async () => {
      // 1. Получаем все записи о прочтении для этого пользователя
      const { data: reads } = await supabase
        .from('chat_reads')
        .select('event_id, last_read_at')
        .eq('user_id', user.id);

      const readMap = new Map(reads?.map(r => [r.event_id, r.last_read_at]) || []);

      // 2. Получаем последние сообщения (за 7 дней, например)
      const { data: messages } = await supabase
        .from('messages')
        .select('id, event_id, created_at')
        .neq('user_id', user.id)
        .gt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (!messages) return;

      // 3. Считаем только те, которые новее, чем last_read_at
      let count = 0;
      for (const msg of messages) {
        const lastRead = readMap.get(msg.event_id);
        if (!lastRead || new Date(msg.created_at) > new Date(lastRead)) {
          count++;
        }
      }

      setUnreadChats(count);
    };

    fetchUnreadCount();

    // Слушаем новые сообщения и обновления прочтений
    const channel = supabase.channel('header-unread-chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
         fetchUnreadCount();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_reads' }, () => {
         fetchUnreadCount();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, pathname]);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
    setIsMobileMenuOpen(false);
  };

    const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-brand-bg border-b-2 border-brand-line">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between px-4 md:px-6 py-3">
          <Link href="/" className="font-extrabold text-2xl tracking-tighter uppercase z-50">
            Намылимся<span className="text-brand-accent">.</span>
          </Link>
          
          {/* Навигация для ПК */}
          <nav className="hidden md:flex gap-6">
            <div className="group flex items-center">
              <NavItem href="/" label="Лента" pathname={pathname} />
            </div>
            <div className="group flex items-center">
              <NavItem href="/my-events" label="Мои события" pathname={pathname} badgeCount={unreadChats} />
            </div>
            <div className="group flex items-center">
              <NavItem href="/archive" label="Архив" pathname={pathname} />
            </div>
          </nav>

          <div className="flex items-center gap-2 md:gap-3 z-50">
                        <button 
              onClick={toggleTheme}
              className="w-10 h-10 hidden md:flex items-center justify-center border-2 border-brand-line rounded-brand bg-brand-surface hover:bg-brand-bg transition-colors"
              title="Сменить тему"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                 <NotificationsBell />
                  <Link href={`/@${username}`} className="text-sm font-bold hover:text-brand-accent transition-colors">
                    @{username}
                  </Link>
                  <button onClick={handleLogout} className="bg-brand-surface text-brand-text font-extrabold text-sm px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-accent hover:text-white transition-colors">
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="bg-brand-surface text-brand-text font-extrabold text-sm px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors">
                    Войти
                  </Link>
                  <Link href="/login?mode=register" className="bg-brand-accent text-brand-accent-ink font-extrabold text-sm px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors">
                    Регистрация
                  </Link>
                </>
              )}
            </div>

            {user && (
              <div className="md:hidden">
                <NotificationsBell />
              </div>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 border-2 border-brand-line rounded-brand bg-brand-surface"
              aria-label="Меню"
            >
              <span className={`block w-5 h-0.5 bg-brand-text transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-brand-text transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-brand-text transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню (Шторка) */}
      <div 
        className={`fixed inset-0 bg-brand-bg z-40 flex flex-col pt-24 px-6 transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {isMobileMenuOpen && (
          <nav className="flex flex-col gap-2 text-2xl font-extrabold">
            <Link href="/" className={`animate-menu-item delay-1 border-b-2 border-brand-line py-4 flex items-center gap-2 ${pathname === '/' ? 'text-brand-accent' : ''}`}>
              {pathname === '/' && <span className="text-brand-accent">[</span>}
              Лента
              {pathname === '/' && <span className="text-brand-accent">]</span>}
            </Link>
            
            <Link href="/my-events" className={`animate-menu-item delay-2 border-b-2 border-brand-line py-4 flex items-center gap-2 ${pathname === '/my-events' ? 'text-brand-accent' : ''}`}>
              {pathname === '/my-events' && <span className="text-brand-accent">[</span>}
              Мои события
              {unreadChats > 0 && <span className="bg-red-500 text-white text-sm px-2 rounded-full">{unreadChats}</span>}
              {pathname === '/my-events' && <span className="text-brand-accent">]</span>}
            </Link>
            
            <Link href="/archive" className={`animate-menu-item delay-3 border-b-2 border-brand-line py-4 flex items-center gap-2 ${pathname === '/archive' ? 'text-brand-accent' : ''}`}>
              {pathname === '/archive' && <span className="text-brand-accent">[</span>}
              Архив
              {pathname === '/archive' && <span className="text-brand-accent">]</span>}
            </Link>
          </nav>
        )}

              <div className="mt-auto mb-10 flex flex-col gap-4">
          
          {/* Кнопка смены темы для мобилок */}
          <button 
            onClick={toggleTheme}
            className="animate-menu-item delay-3 bg-brand-surface text-brand-text font-extrabold text-lg p-3 border-2 border-brand-line rounded-brand flex items-center justify-center gap-2"
          >
            {theme === 'light' ? '🌙 Темная тема' : '☀️ Светлая тема'}
          </button>

          {user ? (
            <>
              <Link href={`/@${username}`} className="animate-menu-item delay-4 text-xl font-bold text-center border-2 border-brand-line p-3 rounded-brand">
                Мой профиль (@{username})
              </Link>
              <button onClick={handleLogout} className="animate-menu-item delay-5 bg-brand-surface text-brand-text font-extrabold text-lg p-3 border-2 border-brand-line rounded-brand">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="animate-menu-item delay-4 bg-brand-surface text-brand-text font-extrabold text-lg p-3 border-2 border-brand-line rounded-brand text-center">
                Войти
              </Link>
              <Link href="/login?mode=register" className="animate-menu-item delay-5 bg-brand-accent text-brand-accent-ink font-extrabold text-lg p-3 border-2 border-brand-line rounded-brand text-center">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
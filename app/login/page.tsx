'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const isRegisterMode = searchParams.get('mode') === 'register';
  const [gender, setGender] = useState('none');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [isLogin, setIsLogin] = useState(!isRegisterMode); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.from('cities').select('name').order('name').then(({ data }) => {
      if (data) setCities(data.map(c => c.name));
    });
  }, []);

  useEffect(() => {
    // Используем небольшую задержку, чтобы избежать синхронного обновления
    const timer = setTimeout(() => {
      setIsLogin(!isRegisterMode);
    }, 0);
    return () => clearTimeout(timer);
  }, [isRegisterMode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        // Вход
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
        router.refresh();
      } else {
                // РЕГИСТРАЦИЯ
        // 1. Создаем пользователя в Auth, передавая никнейм и пол в метаданные
        const { error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              username: username,
              gender: gender,
              city: city,
            }
          }
        });
        
        if (authError) {
          // Если база вернула ошибку уникальности (никнейм занят)
          if (authError.message.includes('duplicate key') || authError.message.includes('unique constraint')) {
            throw new Error('Этот никнейм уже занят. Придумайте другой.');
          }
          throw authError;
        }

        // 2. Профиль создастся автоматически через триггер в базе!
        // Клиентский update больше не нужен.

        setMessage('Регистрация успешна! Теперь вы можете войти.');
        setIsLogin(true);
      }
    } catch (error) {
      let msg = 'Произошла неизвестная ошибка';
      
      // Приводим тип к Error
      if (error instanceof Error) {
        if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
          msg = 'Этот никнейм уже занят.';
        } else if (error.message.includes('Password should be at least')) {
          msg = 'Пароль слишком короткий (минимум 6 символов).';
        } else {
          msg = error.message;
        }
      }
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Следим за появлением iframe от Telegram
    const observer = new MutationObserver(() => {
      const tgIframe = document.querySelector('iframe[src*="telegram.org"]');
      const container = document.getElementById('telegram-widget-container');
      
      if (tgIframe && container && !container.contains(tgIframe)) {
        // Как только Telegram создал iframe, перемещаем его в наш контейнер
        container.appendChild(tgIframe);
        // Сбрасываем позиционирование
        (tgIframe as HTMLElement).style.position = 'static';
        (tgIframe as HTMLElement).style.margin = '0 auto';
        (tgIframe as HTMLElement).style.display = 'block';
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8">
      <h1 className="text-2xl font-extrabold uppercase mb-6 text-center">
        {isLogin ? 'Вход в Намылимся' : 'Регистрация'}
      </h1>

      {message && (
        <div className="mb-4 p-3 bg-brand-bg border-2 border-brand-line rounded-brand text-sm font-bold text-center">
          {message}
        </div>
      )}

   {/* Telegram Login Widget */}
      <div className="w-full flex flex-col items-center mb-6 relative">
        <Script id="telegram-auth-handler" strategy="lazyOnload">
          {`
            window.onTelegramAuth = function (user) {
              fetch('${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/telegram-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
              })
              .then(res => res.json())
              .then(data => {
                if (data.token) {
                  window.location.href = '/auth/callback?token=' + data.token;
                } else {
                  alert('Ошибка входа');
                }
              });
            };
          `}
        </Script>

        {/* Кастомная кнопка */}
        <button
          type="button"
          onClick={() => {
            // @ts-expect-ignore
            if (window.Telegram) {
              // Вызываем окно авторизации Telegram
              // @ts-expect-ignore
              window.Telegram.Login.auth({ bot_id: 'namylimsya_bot', request_access: 'write' }, (user: unknown) => {
                if (user) {
                  // @ts-expect-ignore
                  window.onTelegramAuth(user);
                }
              });
            } else {
              alert('Telegram скрипт еще загружается, подождите пару секунд...');
            }
          }}
          className="w-full bg-[#2AABEE] text-white font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-[#229ED9] transition-colors flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          Войти через Telegram
        </button>
        
        {/* Скрытый виджет Telegram (он нужен только для загрузки API) */}
        <div id="telegram-widget-container" className="hidden">
          <Script 
            src="https://telegram.org/js/telegram-widget.js?22" 
            strategy="lazyOnload"
            data-telegram-login="namylimsya_bot" 
            data-size="large" 
            data-onauth="onTelegramAuth(user)" 
            data-request-access="write"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full mt-6">
          <div className="flex-1 h-px bg-brand-line/50"></div>
          <span className="text-xs font-bold text-brand-muted uppercase">или по email</span>
          <div className="flex-1 h-px bg-brand-line/50"></div>
        </div>
      </div>

      <form onSubmit={handleAuth} className="flex flex-col gap-4">
        
        {/* Поле никнейма только для регистрации */}
        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-username" className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш никнейм (публичное имя)</label>
            <input 
              id="login-username"
              name="username"
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Zа-яА-Я0-9_]/g, ''))}
              required
              autoComplete="username"
              minLength={3}
              maxLength={32}
              placeholder="например: Вадим_Крутой"
              aria-describedby="login-username-hint"
              className="p-2.5 min-h-11 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
            />
            <span id="login-username-hint" className="text-[11px] text-brand-muted font-bold">Разрешены кириллица, латиница, цифры и _. Одинаковые запрещены.</span>
          </div>
        )}

                {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш город</label>
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              required
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors"
            >
              <option value="" disabled>Выберите город</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

         {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш пол (необязательно)</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setGender('male')} className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand ${gender === 'male' ? 'bg-brand-accent text-white' : 'bg-brand-bg'}`}>М</button>
              <button type="button" onClick={() => setGender('female')} className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand ${gender === 'female' ? 'bg-brand-accent text-white' : 'bg-brand-bg'}`}>Ж</button>
              <button type="button" onClick={() => setGender('none')} className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand ${gender === 'none' ? 'bg-brand-accent text-white' : 'bg-brand-bg'}`}>Другой</button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
          />
        </div>

         <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Пароль</label>
            {isLogin && (
              <Link href="/forgot-password" className="text-[11px] font-bold text-brand-accent hover:underline">
                Забыли пароль?
              </Link>
            )}
          </div>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-full p-2.5 pr-10 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors"
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
        </button>


      </form>

      <div className="mt-6 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-sm font-bold text-brand-muted hover:text-brand-accent transition-colors"
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <Link href="/" className="text-sm font-bold text-brand-muted hover:text-brand-accent transition-colors">
          ← Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <Suspense fallback={<div className="text-center font-bold">Загрузка формы...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
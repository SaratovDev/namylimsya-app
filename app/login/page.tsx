'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const TELEGRAM_BOT_USERNAME = 'namylimsya_bot';

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

  const tgContainerRef = useRef<HTMLDivElement>(null);

  // Загрузка городов
  useEffect(() => {
    supabase
      .from('cities')
      .select('name')
      .order('name')
      .then(({ data }) => {
        if (data) setCities(data.map((c) => c.name));
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLogin(!isRegisterMode), 0);
    return () => clearTimeout(timer);
  }, [isRegisterMode]);

  // === TELEGRAM LOGIN ===
  useEffect(() => {
    const handleTelegramAuth = async (user: TelegramUser) => {
      setLoading(true);
      setMessage('Авторизация через Telegram...');
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/telegram-auth`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
          }
        );

        const data = (await res.json()) as { token?: string; error?: string };

        if (!res.ok) throw new Error(data?.error || 'Ошибка сервера');
        if (!data.token) throw new Error('Сервер не вернул токен');

        router.push(`/auth/callback?token=${encodeURIComponent(data.token)}`);
      } catch (err) {
        console.error('Telegram auth error:', err);
        setMessage(err instanceof Error ? err.message : 'Ошибка Telegram');
        setLoading(false);
      }
    };

    window.onTelegramAuth = handleTelegramAuth;

    // Принудительно вставляем скрипт Telegram
    if (tgContainerRef.current) {
      tgContainerRef.current.innerHTML = ''; // Очищаем контейнер
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?23';
      script.async = true;
      script.setAttribute('data-telegram-login', TELEGRAM_BOT_USERNAME);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '4');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      
      tgContainerRef.current.appendChild(script);
    }

    return () => {
      window.onTelegramAuth = undefined;
    };
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    // ... (оставляем твой код формы без изменений)
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
        router.refresh();
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username, gender, city } },
        });

        if (authError) {
          if (authError.message.includes('duplicate key') || authError.message.includes('unique constraint')) {
            throw new Error('Этот никнейм уже занят. Придумайте другой.');
          }
          throw authError;
        }
        setMessage('Регистрация успешна! Теперь вы можете войти.');
        setIsLogin(true);
      }
    } catch (error) {
      let msg = 'Произошла неизвестная ошибка';
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

  return (
    <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8">
      <h1 className="text-2xl font-extrabold uppercase mb-6 text-center">
        {isLogin ? 'Вход в Намылимся' : 'Регистрация'}
      </h1>

      {message && (
        <div className="mb-4 p-3 bg-brand-bg rounded-brand text-sm font-bold text-center">
          {message}
        </div>
      )}

      {/* Контейнер для официальной кнопки Telegram */}
      <div className="w-full flex flex-col items-center mb-6">
        <div className="min-h-[48px] flex items-center justify-center w-full" ref={tgContainerRef}>
          {/* Скрипт вставится сюда через useEffect */}
        </div>

        <div className="flex items-center gap-2 w-full mt-6">
          <div className="flex-1 h-px bg-brand-line/50"></div>
          <span className="text-xs font-bold text-brand-muted uppercase">или по email</span>
          <div className="flex-1 h-px bg-brand-line/50"></div>
        </div>
      </div>

      <form onSubmit={handleAuth} className="flex flex-col gap-4">
        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш никнейм</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Zа-яА-Я0-9_]/g, ''))}
              required
              minLength={3}
              maxLength={32}
              placeholder="например: Вадим_Крутой"
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent"
            />
          </div>
        )}

        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш город</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent"
            >
              <option value="" disabled>Выберите город</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Пароль</label>
            {isLogin && <Link href="/forgot-password" className="text-[11px] font-bold text-brand-accent hover:underline">Забыли пароль?</Link>}
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 pr-10 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-brand-muted hover:text-brand-accent">
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
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
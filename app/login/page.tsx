'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

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
  const [tgReady, setTgReady] = useState(false);
  const router = useRouter();

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
    // Типизированный колбэк, который вызовет официальный виджет
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

        if (!res.ok) {
          throw new Error(data?.error || 'Ошибка авторизации через Telegram');
        }
        if (!data.token) {
          throw new Error('Сервер не вернул токен');
        }

        // Внутренняя навигация — через router.push (см. правило Next.js)
        router.push(`/auth/callback?token=${encodeURIComponent(data.token)}`);
      } catch (err) {
        console.error('Telegram auth error:', err);
        setMessage(
          err instanceof Error ? err.message : 'Ошибка Telegram-авторизации'
        );
        setLoading(false);
      }
    };

    window.onTelegramAuth = handleTelegramAuth;

    return () => {
      window.onTelegramAuth = undefined;
    };
  }, [router]);

  // Проверяем, загрузился ли telegram-widget.js
  useEffect(() => {
    const check = setInterval(() => {
      if (window.Telegram) {
        setTgReady(true);
        clearInterval(check);
      }
    }, 300);
    return () => clearInterval(check);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
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
          if (
            authError.message.includes('duplicate key') ||
            authError.message.includes('unique constraint')
          ) {
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
        if (
          error.message.includes('duplicate key') ||
          error.message.includes('unique constraint')
        ) {
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

               {/* === TELEGRAM LOGIN WIDGET === */}
      <div className="w-full flex flex-col items-center mb-6">
        {/* Контейнер с фиксированной высотой, чтобы кнопка не уезжала под футер */}
        <div className="h-[48px] flex items-center justify-center w-full">
          <Script
            id="telegram-widget"
            src="https://telegram.org/js/telegram-widget.js?23"
            strategy="lazyOnload"
            data-telegram-login={TELEGRAM_BOT_USERNAME}
            data-size="large"
            data-radius="4"
            data-onauth="onTelegramAuth(user)"
            data-request-access="write"
            onLoad={() => setTgReady(true)}
          />
        </div>

        {!tgReady && (
          <p className="text-xs font-bold text-brand-muted mt-2">
            Загрузка Telegram-кнопки...
          </p>
        )}

        <div className="flex items-center gap-2 w-full mt-6">
          <div className="flex-1 h-px bg-brand-line/50"></div>
          <span className="text-xs font-bold text-brand-muted uppercase">или по email</span>
          <div className="flex-1 h-px bg-brand-line/50"></div>
        </div>
      </div>

      <form onSubmit={handleAuth} className="flex flex-col gap-4">
        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-username"
              className="text-[12px] font-extrabold uppercase text-brand-muted"
            >
              Ваш никнейм (публичное имя)
            </label>
            <input
              id="login-username"
              name="username"
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.replace(/[^a-zA-Zа-яА-Я0-9_]/g, ''))
              }
              required
              autoComplete="username"
              minLength={3}
              maxLength={32}
              placeholder="например: Вадим_Крутой"
              className="p-2.5 min-h-11 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors"
            />
            <span className="text-[11px] text-brand-muted font-bold">
              Разрешены кириллица, латиница, цифры и _. Одинаковые запрещены.
            </span>
          </div>
        )}

        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">
              Ваш город
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors"
            >
              <option value="" disabled>
                Выберите город
              </option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">
              Ваш пол (необязательно)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand ${
                  gender === 'male' ? 'bg-brand-accent text-white' : 'bg-brand-bg'
                }`}
              >
                М
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand ${
                  gender === 'female' ? 'bg-brand-accent text-white' : 'bg-brand-bg'
                }`}
              >
                Ж
              </button>
              <button
                type="button"
                onClick={() => setGender('none')}
                className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand ${
                  gender === 'none' ? 'bg-brand-accent text-white' : 'bg-brand-bg'
                }`}
              >
                Другой
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">
            Email
          </label>
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
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">
              Пароль
            </label>
            {isLogin && (
              <Link
                href="/forgot-password"
                className="text-[11px] font-bold text-brand-accent hover:underline"
              >
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
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
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
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm font-bold text-brand-muted hover:text-brand-accent transition-colors"
        >
          {isLogin
            ? 'Нет аккаунта? Зарегистрироваться'
            : 'Уже есть аккаунт? Войти'}
        </button>
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/"
          className="text-sm font-bold text-brand-muted hover:text-brand-accent transition-colors"
        >
          ← Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <Suspense
        fallback={<div className="text-center font-bold">Загрузка формы...</div>}
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
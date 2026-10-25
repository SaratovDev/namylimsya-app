'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Твой Client ID из настроек Login Widget
const TELEGRAM_CLIENT_ID = '8934385689'; 

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
      if (data) setCities(data.map((c) => c.name));
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLogin(!isRegisterMode), 0);
    return () => clearTimeout(timer);
  }, [isRegisterMode]);

    // Перехватываем токен, который Telegram шлет в URL
  // Перехватываем токен, который Telegram шлет в URL
  useEffect(() => {
    const qtoken = searchParams.get('qtoken');
    if (qtoken) {
      setLoading(true);
      setMessage('Авторизация через Telegram...');
      
      // Отправляем токен на нашу Edge-функцию
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/telegram-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: qtoken }), // Передаем как code
      })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
        
        if (data.token) {
          return supabase.auth.verifyOtp({ token_hash: data.token, type: 'magiclink' });
        }
        throw new Error('Нет токена от Supabase');
      })
      .then(({ error }) => {
        if (error) throw error;
        router.push('/');
        router.refresh();
      })
      .catch(err => {
        console.error(err);
        setMessage(err.message || 'Ошибка Telegram');
        setLoading(false);
      });
    }
  }, [searchParams, router]);

  // === НОВЫЙ МЕТОД: ПРОСТО РЕДИРЕКТ В TELEGRAM ===
  const handleTgLogin = () => {
    // Берем текущий домен и добавляем путь для колбэка
    const redirectUri = `${window.location.origin}/auth/callback`;
    
    // Формируем ссылку для Telegram OpenID Connect
    const url = `https://oauth.telegram.org/auth?client_id=${TELEGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid+profile`;
    
    // Перенаправляем пользователя
    window.location.href = url;
  };

  // === ОБЫЧНЫЙ ВХОД ПО EMAIL ===
  const handleAuth = async (e: React.FormEvent) => {
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

      {/* Кнопка Telegram */}
      <div className="w-full flex flex-col items-center mb-6">
        <button
          type="button"
          onClick={handleTgLogin}
          className="w-full bg-[#2AABEE] text-white font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-[#229ED9] transition-colors flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.460-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          Войти через Telegram
        </button>
      </div>

      <div className="flex items-center gap-2 w-full mb-6">
        <div className="flex-1 h-px bg-brand-line/50"></div>
        <span className="text-xs font-bold text-brand-muted uppercase">или по email</span>
        <div className="flex-1 h-px bg-brand-line/50"></div>
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
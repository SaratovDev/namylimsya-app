'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

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

  // === ВХОД ЧЕРЕЗ GOOGLE ===
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  // === ВХОД ЧЕРЕЗ VK ===
  const handleVkLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'vk' as any,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  // === ВХОД ПО EMAIL ===
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
        // Безопасная передача данных: если поле пустое, передаем undefined
        const metadata = {
          username: username.trim() || undefined,
          gender: gender || undefined,
          city: city || undefined,
        };

        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: metadata },
        });

        if (authError) {
          if (authError.message.includes('duplicate key') || authError.message.includes('unique constraint')) {
            throw new Error('Этот никнейм или email уже заняты.');
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
          msg = 'Этот никнейм или email уже заняты.';
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

      {/* Кнопки OAuth */}
      <div className="w-full flex flex-col gap-3 mb-6">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-gray-800 font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-gray-300 rounded-brand hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Войти через Google
        </button>
        
        <button
          type="button"
          onClick={handleVkLogin}
          disabled={loading}
          className="w-full bg-[#0077FF] text-white font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-[#005BCC] rounded-brand hover:bg-[#0066DD] transition-colors flex items-center justify-center gap-2"
        >
          Войти через ВКонтакте
        </button>
      </div>

      <div className="flex items-center gap-2 w-full mb-6">
        <div className="flex-1 h-px bg-brand-line/50"></div>
        <span className="text-xs font-bold text-brand-muted uppercase">или по email</span>
        <div className="flex-1 h-px bg-brand-line/50"></div>
      </div>

      <form onSubmit={handleAuth} className="flex flex-col gap-4">
        {!isLogin && (
          <>
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

            {/* ВОЗВРАЩАЕМ ВЫБОР ПОЛА */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш пол (необязательно)</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setGender('male')} className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand transition-colors ${gender === 'male' ? 'bg-brand-accent text-white' : 'bg-brand-bg'}`}>М</button>
                <button type="button" onClick={() => setGender('female')} className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand transition-colors ${gender === 'female' ? 'bg-brand-accent text-white' : 'bg-brand-bg'}`}>Ж</button>
                <button type="button" onClick={() => setGender('none')} className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand transition-colors ${gender === 'none' ? 'bg-brand-accent text-white' : 'bg-brand-bg'}`}>Другой</button>
              </div>
            </div>
          </>
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
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
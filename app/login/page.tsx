'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const searchParams = useSearchParams();
  const isRegisterMode = searchParams.get('mode') === 'register';
  const [gender, setGender] = useState('none');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(!isRegisterMode); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

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
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш никнейм (публичное имя)</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Zа-яА-Я0-9_]/g, ''))} // Только буквы, цифры и _
              required
              placeholder="например: Вадим_Крутой"
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
            />
            <span className="text-[11px] text-brand-muted font-bold">Разрешены кириллица, латиница, цифры и _. Одинаковые запрещены.</span>
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
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Пароль</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
          />
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
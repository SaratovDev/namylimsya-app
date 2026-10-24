'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import Link from 'next/link';

export default function SupportPage() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Оспорить блокировку');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showError } = useToast();

  // Если пользователь авторизован, подтягиваем его email
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmail(user.email);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length < 10) {
      showError('Сообщение должно быть не короче 10 символов');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('support_tickets').insert({
        email,
        subject,
        message,
      });

      if (error) throw error;
      
      setSuccess(true);
      setMessage('');
    } catch (error) {
      console.error(error);
      showError('Не удалось отправить обращение. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="max-w-md mx-auto mt-20 px-6">
        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8 text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h1 className="text-2xl font-extrabold uppercase mb-4">Обращение отправлено!</h1>
          <p className="text-brand-muted font-bold mb-6">
            Мы получили ваше сообщение и ответим на него по указанному email в ближайшее время.
          </p>
          <Link href="/" className="inline-block bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors">
            Вернуться на главную
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto mt-20 px-6 mb-20">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8">
        <h1 className="text-2xl font-extrabold uppercase mb-2 text-center">Поддержка</h1>
        <p className="text-sm text-brand-muted font-bold text-center mb-6">
          Опишите вашу проблему или предложение, и мы свяжемся с вами.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="your@email.com"
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Тема обращения</label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors"
            >
              <option value="Оспорить блокировку">Оспорить блокировку</option>
              <option value="Пожаловаться на нарушение">Пожаловаться на нарушение</option>
              <option value="Предложение по улучшению">Предложение по улучшению сервиса</option>
              <option value="Другое">Другое</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Сообщение</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Подробно опишите вашу ситуацию..."
              rows={5}
              required
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
          >
            {loading ? 'Отправка...' : 'Отправить обращение'}
          </button>
        </form>
      </div>
    </main>
  );
}
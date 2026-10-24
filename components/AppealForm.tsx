'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './Toast';

export default function AppealForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadySent, setAlreadySent] = useState(false);
  const { showSuccess, showError } = useToast();

  // При открытии модалки проверяем, есть ли уже обращение от этого юзера
  useEffect(() => {
    if (isOpen) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) setEmail(user.email);
        
        // Проверяем, есть ли уже НЕрешенное обращение по этому email
        supabase
          .from('support_tickets')
          .select('id')
          .eq('email', user?.email || email)
          .eq('status', 'new')
          .maybeSingle()
          .then(({ data }) => {
            if (data) setAlreadySent(true);
          });
      });
    }
  }, [isOpen, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length < 10) {
      showError('Сообщение должно быть не короче 10 символов');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Проверка перед вставкой (на случай, если кто-то вздумает обойти UI)
      const { data: existing } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('email', email)
        .eq('status', 'new')
        .maybeSingle();

      if (existing) {
        throw new Error('Вы уже отправили обращение. Пожалуйста, дождитесь ответа.');
      }

      const { error } = await supabase.from('support_tickets').insert({
        user_id: user?.id || null,
        email: email,
        subject: 'Оспорить блокировку',
        message: message,
      });

      if (error) throw error;
      
      showSuccess('Обращение отправлено! Мы свяжемся с вами.');
      setIsOpen(false);
      setAlreadySent(true);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors"
      >
        Оспорить блокировку
      </button>

      {isOpen && (
        <div className="fixed inset-0 `z-100` flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => !loading && setIsOpen(false)}></div>
          
          <div className="relative bg-brand-bg border-2 border-brand-line rounded-brand-lg p-6 max-w-md w-full text-left">
            <h2 className="text-xl font-extrabold uppercase mb-2">Оспорить блокировку</h2>
            
            {alreadySent ? (
              <div className="bg-green-100 text-green-800 p-4 rounded border-2 border-green-300 font-bold text-sm">
                Вы уже отправили обращение. Пожалуйста, дождитесь ответа администрации.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш Email (для ответа)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    readOnly={!!email}
                    className="p-2.5 bg-brand-surface border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-extrabold uppercase text-brand-muted">Объясните ситуацию</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Опишите, почему вы считаете блокировку ошибкой..."
                    rows={4}
                    required
                    className="p-2.5 bg-brand-surface border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                    className="flex-1 bg-brand-surface text-brand-text font-extrabold text-sm uppercase px-4 py-3 border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors disabled:opacity-50"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-4 py-3 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Отправка...' : 'Отправить'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
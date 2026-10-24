'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';

export default function TicketActions({ ticketId, currentStatus, userEmail }: { ticketId: string, currentStatus: string, userEmail: string }) {
  const [loading, setLoading] = useState(false);
  const [banLoading, setBanLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  // 1. Смена статуса тикета
  const toggleStatus = async () => {
    setLoading(true);
    const newStatus = currentStatus === 'new' ? 'resolved' : 'new';
    const { error } = await supabase.from('support_tickets').update({ status: newStatus }).eq('id', ticketId);
    
    if (error) showError('Ошибка обновления');
    else {
      showSuccess(newStatus === 'resolved' ? 'Отмечено как решенное' : 'Возвращено в новые');
      router.refresh();
    }
    setLoading(false);
  };

  // 2. Разбан пользователя по email
  const handleUnban = async () => {
    if (!confirm(`Попытаться разбанить пользователя с email ${userEmail}?`)) return;
    
    setBanLoading(true);
    try {
      // Ищем пользователя по email в профиле
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (!profile) {
        showError('Пользователь с таким email не найден');
        return;
      }

      // Снимаем бан
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: false })
        .eq('id', profile.id);

      if (error) throw error;
      
      showSuccess('Пользователь успешно разбанен!');
      router.refresh();
    } catch {
      showError('Ошибка при разбане');
    } finally {
      setBanLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={toggleStatus} 
        disabled={loading} 
        className={`text-xs font-bold px-3 py-1.5 border-2 rounded-brand transition-colors ${
          currentStatus === 'new' ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
        }`}
      >
        {loading ? '...' : currentStatus === 'new' ? 'Отметить решенным' : 'Вернуть в новые'}
      </button>
      
      {/* Кнопка разбана (показываем только если статус тикета - 'new') */}
      {currentStatus === 'new' && (
        <button 
          onClick={handleUnban} 
          disabled={banLoading} 
          className="text-xs font-bold px-3 py-1.5 bg-brand-surface text-brand-text border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors"
        >
          {banLoading ? '...' : 'Разбанить'}
        </button>
      )}
    </div>
  );
}
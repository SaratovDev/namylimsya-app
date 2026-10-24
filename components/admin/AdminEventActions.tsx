'use client';

import { useState } from 'react';
import { adminDeleteEvent } from '@/app/actions';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';

export default function AdminEventActions({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('ВНИМАНИЕ! Вы уверены, что хотите НАВСЕГДА удалить это событие? Все заявки и сообщения в чате также будут удалены.')) return;

    setLoading(true);
    try {
      const res = await adminDeleteEvent(eventId);
      if (res?.error) showError(res.error);
      else {
        showSuccess('Событие удалено');
        router.refresh();
      }
    } catch (error) {
      showError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-bold px-3 py-1.5 bg-red-100 text-red-700 border-2 border-red-300 rounded-brand hover:bg-red-200 transition-colors disabled:opacity-50"
    >
      {loading ? 'Удаление...' : 'Удалить'}
    </button>
  );
}
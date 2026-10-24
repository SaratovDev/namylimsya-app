'use client';

import { useState } from 'react';
import { cancelEvent } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useToast } from './Toast';
import CancelModal from './CancelModal';

export default function EventAdminActions({ eventId, eventTitle }: { eventId: string, eventTitle: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const handleConfirmCancel = async (reason: string) => {
    setLoading(true);
    try {
      const res = await cancelEvent(eventId, reason);
      if (res?.error) showError(res.error);
      else {
        showSuccess('Событие отменено. Участники уведомлены.');
        router.push('/my-events');
      }
    } catch{
      showError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-red-100 text-red-700 font-extrabold text-sm uppercase px-4 py-2 border-2 border-red-300 rounded-brand hover:bg-red-200 transition-colors w-full"
      >
        Отменить событие
      </button>

      <CancelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        role="organizer"
        eventTitle={eventTitle}
        loading={loading}
      />
    </>
  );
}
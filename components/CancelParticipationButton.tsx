'use client';

import { useState } from 'react';
import { cancelApprovedApplication } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useToast } from './Toast';
import CancelModal from './CancelModal';

export default function CancelParticipationButton({ eventId, eventTitle }: { eventId: string, eventTitle: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const handleConfirmCancel = async (reason: string) => {
    setLoading(true);
    try {
      const res = await cancelApprovedApplication(eventId, reason);
      if (res?.error) showError(res.error);
      else {
        showSuccess('Вы сняли заявку. Организатор уведомлен.');
        setIsModalOpen(false);
        router.refresh();
      }
    } catch (error) {
      showError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-2 bg-brand-surface text-brand-muted font-extrabold text-sm uppercase px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors"
      >
        Отменить участие
      </button>

      <CancelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        role="participant"
        eventTitle={eventTitle}
        loading={loading}
      />
    </>
  );
}
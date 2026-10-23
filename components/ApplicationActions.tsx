'use client';

import { useState } from 'react';
import { approveApplication, rejectApplication } from '@/app/actions';
import { useToast } from './Toast';

export default function ApplicationActions({ applicationId }: { applicationId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

    const handleApprove = async () => {
    setIsLoading(true);
    try {
      const res = await approveApplication(applicationId);
      if (res?.error) showError(res.error);
      else showSuccess('Заявка подтверждена!');
    } catch {
      showError('Ошибка при подтверждении');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Вы уверены, что хотите отклонить эту заявку?')) return;
    setIsLoading(true);
    try {
      const res = await rejectApplication(applicationId);
      if (res?.error) showError(res.error);
      else showSuccess('Заявка отклонена');
    } catch {
      showError('Ошибка при отклонении');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex gap-1.5 flex-shrink-0 ml-2">
      <button 
        onClick={handleApprove}
        disabled={isLoading}
        aria-label="Принять заявку"
        aria-busy={isLoading}
        className="w-11 h-11 flex items-center justify-center bg-green-100 text-green-700 border-2 border-green-600 rounded-brand hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50"
      >
        {isLoading ? '...' : '✓'}
      </button>
      <button 
        onClick={handleReject}
        disabled={isLoading}
        aria-label="Отклонить заявку"
        aria-busy={isLoading}
        className="w-11 h-11 flex items-center justify-center bg-red-100 text-red-700 border-2 border-red-600 rounded-brand hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
      >
        {isLoading ? '...' : '✕'}
      </button>
    </div>
  );
}
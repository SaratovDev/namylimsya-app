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
      await approveApplication(applicationId);
      showSuccess('Заявка подтверждена!'); // <-- Тост успеха
    } catch (error: any) {
      showError(error.message || 'Ошибка при подтверждении'); // <-- Тост ошибки
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Вы уверены, что хотите отклонить эту заявку?')) return;
    
    setIsLoading(true);
    try {
      await rejectApplication(applicationId);
      showSuccess('Заявка отклонена'); // <-- Тост успеха
    } catch (error: any) {
      showError(error.message || 'Ошибка при отклонении'); // <-- Тост ошибки
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex gap-1.5 flex-shrink-0 ml-2">
      <button 
        onClick={handleApprove}
        disabled={isLoading}
        className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 border-2 border-green-600 rounded-brand hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50"
        title="Принять"
      >
        {isLoading ? '...' : '✓'}
      </button>
      <button 
        onClick={handleReject}
        disabled={isLoading}
        className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-700 border-2 border-red-600 rounded-brand hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
        title="Отклонить"
      >
        {isLoading ? '...' : '✕'}
      </button>
    </div>
  );
}
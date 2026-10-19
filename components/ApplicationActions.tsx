'use client';

import { useState } from 'react';
import { approveApplication, rejectApplication } from '@/app/actions';

export default function ApplicationActions({ applicationId }: { applicationId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await approveApplication(applicationId);
    } catch (error) {
      console.error("Ошибка при подтверждении:", error); // <--- ВЫВОД В КОНСОЛЬ
      alert('Ошибка при подтверждении. Проверьте консоль.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Вы уверены, что хотите отклонить эту заявку?')) return;
    
    setIsLoading(true);
    try {
      await rejectApplication(applicationId);
    } catch (error) {
      console.error("Ошибка при отклонении:", error); // <--- ВЫВОД В КОНСОЛЬ
      alert('Ошибка при отклонении. Проверьте консоль.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleApprove}
        disabled={isLoading}
        className="bg-green-600 text-white px-3 py-1 text-xs font-bold uppercase rounded border-2 border-green-800 hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? '...' : 'Принять'}
      </button>
      <button 
        onClick={handleReject}
        disabled={isLoading}
        className="bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase rounded border-2 border-red-700 hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        {isLoading ? '...' : 'Отклонить'}
      </button>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useToast } from './Toast';

export type CancelRole = 'organizer' | 'participant';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  role: CancelRole;
  eventTitle: string;
  loading?: boolean;
}

export default function CancelModal({ isOpen, onClose, onConfirm, role, eventTitle, loading = false }: CancelModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const { showError } = useToast();

  if (!isOpen) return null;

  // Разные причины для орга и участника
  const reasons = role === 'organizer' 
    ? [
        'Плохая погода или форс-мажор',
        'Не набралось достаточно участников',
        'Изменились планы организатора',
        'Другое'
      ]
    : [
        'Изменились планы / не могу прийти',
        'Заболел / плохое самочувствие',
        'Неудобно добираться до места',
        'Другое'
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalReason = selectedReason === 'Другое' ? customReason.trim() : selectedReason;
    
    if (!finalReason) {
      showError('Пожалуйста, укажите причину отмены');
      return;
    }

    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Задний фон */}
      <div className="absolute inset-0 bg-black/60" onClick={() => !loading && onClose()}></div>
      
      {/* Модалка */}
      <div className="relative bg-brand-bg border-2 border-brand-line rounded-brand-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-extrabold uppercase mb-2 text-center text-red-600">
          {role === 'organizer' ? 'Отмена события' : 'Отмена участия'}
        </h2>
        <p className="text-sm text-brand-muted font-bold text-center mb-6">
          {role === 'organizer' 
            ? `Вы уверены, что хотите отменить «${eventTitle}»?`
            : `Вы уверены, что хотите снять свою заявку с «${eventTitle}»?`}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Укажите причину (обязательно)</label>
            
            {reasons.map((reason) => (
              <label key={reason} className="flex items-center gap-2 cursor-pointer p-2 bg-brand-surface border-2 border-transparent hover:border-brand-line rounded-brand transition-colors">
                <input 
                  type="radio" 
                  name="reason" 
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 accent-brand-accent"
                />
                <span className="text-sm font-bold">{reason}</span>
              </label>
            ))}
          </div>

          {/* Поле для ввода своей причины */}
          {selectedReason === 'Другое' && (
            <div className="flex flex-col gap-1.5">
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Напишите вашу причину..."
                rows={3}
                maxLength={300}
                className="p-2.5 bg-brand-surface border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors resize-none"
              />
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-brand-surface text-brand-text font-extrabold text-sm uppercase px-4 py-3 border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors disabled:opacity-50"
            >
              Назад
            </button>
            <button
              type="submit"
              disabled={loading || !selectedReason}
              className="flex-1 bg-red-600 text-white font-extrabold text-sm uppercase px-4 py-3 border-2 border-red-800 rounded-brand hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Отправка...' : 'Подтвердить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
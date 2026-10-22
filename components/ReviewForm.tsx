'use client';

import { useState } from 'react';
import { leaveReview } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ eventId }: { eventId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leaveReview(eventId, rating, comment);
      alert('Спасибо за ваш отзыв!');
      setIsOpen(false);
      router.refresh(); // Обновляем страницу, чтобы кнопка пропала
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors w-full"
      >
        Оставить отзыв о событии
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Задний фон */}
          <div className="absolute inset-0 bg-black/60" onClick={() => !loading && setIsOpen(false)}></div>
          
          {/* Модалка */}
          <div className="relative bg-brand-bg border-2 border-brand-line rounded-brand-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-extrabold uppercase mb-4 text-center">Ваш отзыв</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Звезды */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    <span className={(hoveredRating || rating) >= star ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                  </button>
                ))}
              </div>

              {/* Комментарий */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-extrabold uppercase text-brand-muted">Комментарий (необязательно)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Как все прошло?"
                  rows={4}
                  maxLength={500}
                  className="p-2.5 bg-brand-surface border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
              >
                {loading ? 'Отправка...' : 'Отправить отзыв'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
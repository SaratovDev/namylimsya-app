'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import EventCard from './EventCard';
import { EventListItemDTO } from '@/lib/event-dto';

interface InfiniteEventListProps {
  initialItems: EventListItemDTO[];
  initialTotal: number;
  filters: { category?: string; dateFrom?: string; dateTo?: string; city?: string };
}

export default function InfiniteEventList({ initialItems, initialTotal, filters }: InfiniteEventListProps) {
  const [items, setItems] = useState<EventListItemDTO[]>(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialItems.length < initialTotal);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Функция подгрузки
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      queryParams.set('page', (page + 1).toString());
      if (filters.category) queryParams.set('category', filters.category);
      if (filters.dateFrom) queryParams.set('date_from', filters.dateFrom);
      if (filters.dateTo) queryParams.set('date_to', filters.dateTo);
    if (filters.city) queryParams.set('city', filters.city);

      const res = await fetch(`/api/events?${queryParams.toString()}`);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        setItems(prev => [...prev, ...data.items]);
        setPage(prev => prev + 1);
        // Если загрузили меньше лимита, значит больше нет
        if (data.items.length < 10) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, filters]);

  // Настройка Intersection Observer (следим за нижним блоком)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore]);

  // Если фильтры поменялись, сбрасываем список
  useEffect(() => {
    setItems(initialItems);
    setPage(1);
    setHasMore(initialItems.length < initialTotal);
  }, [initialItems, initialTotal]);

  if (items.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
        По вашим фильтрам ничего не найдено.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {items.map((item) => (
        <EventCard key={item.id} item={item} />
      ))}
      
      {/* Триггер для загрузки (невидимый блок внизу) */}
      {hasMore && (
        <div ref={observerTarget} className="py-8 flex justify-center w-full">
          {loading ? (
            <div className="flex items-center gap-2 text-brand-muted font-bold">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Загрузка...
            </div>
          ) : (
            <span className="text-brand-muted font-bold text-sm opacity-50">Прокрутите вниз...</span>
          )}
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="text-center py-6 text-brand-muted font-bold text-sm border-t-2 border-brand-line w-full mt-4">
          Вы посмотрели все события
        </div>
      )}
    </div>
  );
}
// components/EventList.tsx
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { getViewer } from '@/lib/event-access';
import { getEventListDTOs } from '@/lib/event-queries';
import EventCard from './EventCard';

export default async function EventList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 10; // Сколько грузим за раз
  const offset = (currentPage - 1) * limit;

  const supabase = await createClient();
  const viewer = await getViewer(supabase);

  let result;
  try {
    result = await getEventListDTOs(supabase, viewer, limit, offset);
  } catch (error) {
    console.error('ОШИБКА БАЗЫ:', error);
    return (
      <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
        Не удалось загрузить события. Попробуйте обновить страницу.
      </div>
    );
  }

  const { items, total } = result;
  const hasMore = offset + items.length < total;

  if (items.length === 0 && currentPage === 1) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
        Пока нет событий. Станьте первым организатором!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {items.map((item) => (
        <EventCard key={item.id} item={item} />
      ))}
      
      {/* Кнопка "Показать ещё" */}
      {hasMore && (
        <Link
          href={`/?page=${currentPage + 1}`}
          className="mt-4 px-6 py-3 bg-brand-surface border-2 border-brand-line rounded-brand font-extrabold uppercase hover:bg-brand-bg transition-colors"
        >
          Показать ещё
        </Link>
      )}
    </div>
  );
}
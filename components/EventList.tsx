// components/EventList.tsx
import { createClient } from '@/lib/supabase-server';
import { getViewer } from '@/lib/event-access';
import { getEventListDTOs } from '@/lib/event-queries';
import InfiniteEventList from './InfiniteEventList';

export default async function EventList({
  searchParams,
}: {
   searchParams: Promise<{ page?: string, category?: string, date_from?: string, date_to?: string, city?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const dateFrom = params.date_from;
  const dateTo = params.date_to;
  const city = params.city;
  
  // Всегда грузим только первую страницу на сервере
  const limit = 10;
  const offset = 0;

  const supabase = await createClient();
  const viewer = await getViewer(supabase);

  let result;
  try {
    result = await getEventListDTOs(supabase, viewer, limit, offset, false, {
      category,
      dateFrom,
      dateTo,
      city
    });
  } catch (error) {
    console.error('ОШИБКА БАЗЫ:', error);
    return (
      <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
        Не удалось загрузить события. Попробуйте обновить страницу.
      </div>
    );
  }

  return (
    <InfiniteEventList 
      initialItems={result.items} 
      initialTotal={result.total} 
      filters={{ category, dateFrom, dateTo, city }} 
    />
  );
}
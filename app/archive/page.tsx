import { createClient } from '@/lib/supabase-server';
import { getViewer } from '@/lib/event-access';
import { getEventListDTOs } from '@/lib/event-queries';
import EventCard from '@/components/EventCard';
import Link from 'next/link';

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const supabase = await createClient();
  const viewer = await getViewer(supabase);

  const { items, total } = await getEventListDTOs(supabase, viewer, limit, offset, true); // true = архив
  const hasMore = offset + items.length < total;

   return (
    <main className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-extrabold uppercase mb-8 border-b-2 border-brand-line pb-4">
        Архив событий
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
          В архиве пока нет завершенных событий.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Сетка карточек: 1 колонка на мобилках, 2 на ПК */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div key={item.id} className="h-full">
                <EventCard item={item} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-4">
              <Link
                href={`/archive?page=${currentPage + 1}`}
                className="inline-block px-6 py-3 bg-brand-surface border-2 border-brand-line rounded-brand font-extrabold uppercase hover:bg-brand-bg transition-colors"
              >
                Показать ещё
              </Link>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
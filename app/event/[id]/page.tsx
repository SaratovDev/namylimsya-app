import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ClientMapWrapper from '@/components/ClientMapWrapper';
import EventChat from '@/components/EventChat';
import ReviewForm from '@/components/ReviewForm';
import { getViewer } from '@/lib/event-access';
import { canSeeExactLocation } from '@/lib/event-access';

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const viewer = await getViewer(supabase);

  // 1. Получаем событие
  const { data: event } = await supabase
    .from('events')
    .select(`
      *,
      profiles!events_organizer_profile_fkey ( username, avatar_url, gender )
    `)
    .eq('id', id)
    .single();

  if (!event) notFound();

  // 2. Получаем статус заявки
  let myAppStatus = null;
  if (viewer.kind === 'user') {
    const { data: app } = await supabase
      .from('applications')
      .select('status')
      .eq('event_id', id)
      .eq('user_id', viewer.userId)
      .maybeSingle();
    myAppStatus = app?.status || null;
  }

  // 3. Проверки
  const canSeeLocation = canSeeExactLocation(event, viewer, myAppStatus);
  const hasExactCoords = typeof event.lat === 'number' && typeof event.lng === 'number' && canSeeLocation;
  const isOrganizer = viewer.kind === 'user' && viewer.userId === event.organizer_id;
  const isPast = new Date(event.date_time) < new Date();

  // 4. Проверяем, может ли пользователь оставить отзыв
  let canReview = false;
  if (viewer.kind === 'user') {
    if (isPast && myAppStatus === 'approved') {
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('event_id', id)
        .eq('author_id', viewer.userId)
        .maybeSingle();
        
      if (!existingReview) canReview = true;
    }
  }

  // 5. Получаем рейтинг события
  const { data: eventRating } = await supabase
    .rpc('get_event_rating', { ev_id: id })
    .single<{ average_rating: number; total_reviews: number }>();

  // Данные для UI
  const d = new Date(event.date_time);
  const dateStr = d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeStr = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const organizer = Array.isArray(event.profiles) ? event.profiles[0] : event.profiles;

  return (
    <main className="max-w-[1000px] mx-auto px-4 md:px-6 py-10 min-h-screen">
      
      <Link href="/" className="text-brand-muted font-bold text-sm uppercase hover:text-brand-accent transition-colors mb-6 inline-block">
        ← Вернуться в ленту
      </Link>

      {/* Шапка события */}
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 md:p-8 mb-8 relative">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2 py-1 rounded border border-brand-cat/30 mb-4 inline-block">
              {event.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{event.title}</h1>
            
            <div className="flex flex-col gap-2 text-sm font-bold text-brand-muted">
              <p className="flex items-center gap-2">
                <span className="text-brand-accent text-lg">🗓</span>
                {dateStr} в {timeStr}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-brand-accent text-lg">📍</span>
                {canSeeLocation ? event.location : "Место скрыто организатором"} 
              </p>
              
              {/* Плашка "Событие прошло" переехала сюда */}
              {isPast && (
                <div className="mt-2 inline-block bg-brand-bg border-2 border-brand-line px-3 py-1 rounded text-brand-muted font-extrabold text-xs uppercase">
                  Событие уже прошло
                </div>
              )}
            </div>
          </div>

          {/* Правая часть шапки: Организатор + Рейтинг */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            
            {/* Блок организатора */}
            <div className="bg-brand-bg p-4 rounded-brand border-2 border-brand-line flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                 {organizer?.avatar_url ? (
                   <Image src={organizer.avatar_url} alt={event.organizer_name} width={40} height={40} className="object-cover w-full h-full" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center font-extrabold text-gray-500">
                     {event.organizer_name.charAt(0)}
                   </div>
                 )}
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase text-brand-muted">Организатор</p>
                <Link href={`/@${organizer?.username || event.organizer_name}`} className="font-bold hover:text-brand-accent">
                  @{organizer?.username || event.organizer_name}
                </Link>
              </div>
            </div>

            {/* Рейтинг события (переехал сюда) */}
            <div className="bg-brand-bg p-3 rounded-brand border-2 border-brand-line text-center">
              <h3 className="text-[10px] font-extrabold uppercase text-brand-muted mb-1">Рейтинг события</h3>
              {eventRating && eventRating.total_reviews > 0 ? (
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xl font-extrabold">{eventRating.average_rating}</span>
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-xs text-brand-muted font-bold ml-1">({eventRating.total_reviews})</span>
                </div>
              ) : (
                <p className="text-xs font-bold text-brand-muted">Пока нет отзывов</p>
              )}
            </div>
            
          </div>
        </div>
      </div>

      {/* Теперь контент идет в одну колонку на всю ширину */}
      <div className="flex flex-col gap-8">
        
        {/* Кнопка оставить отзыв (если можно) */}
        {canReview && (
          <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6">
            <h2 className="text-xl font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Поделитесь впечатлениями</h2>
            <ReviewForm eventId={event.id} />
          </div>
        )}

        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6">
          <h2 className="text-xl font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Описание</h2>
          <p className="text-brand-text whitespace-pre-wrap leading-relaxed">{event.description}</p>
        </div>

        {/* Карта */}
        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6">
          <h2 className="text-xl font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Локация</h2>
          {hasExactCoords ? (
            <ClientMapWrapper lat={event.lat} lng={event.lng} title={event.title} />
          ) : (
            <div className="h-48 bg-brand-bg border-2 border-dashed border-brand-line rounded flex items-center justify-center text-brand-muted font-bold text-center p-4">
              Точное место откроется после подтверждения вашей заявки.
            </div>
          )}
        </div>

        {/* Чат */}
        {(isOrganizer || myAppStatus === 'approved' || myAppStatus === 'pending') && viewer.kind === 'user' && (
          <div>
            <h2 className="text-xl font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Чат события</h2>
            <EventChat eventId={event.id} currentUserId={viewer.userId} />
          </div>
        )}

      </div>
    </main>
  );
}
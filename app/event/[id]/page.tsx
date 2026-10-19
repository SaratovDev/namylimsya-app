import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Map from '@/components/MapComponent';
import Link from 'next/link';
import EventChat from '@/components/EventChat';

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  // Получаем событие
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (!event) notFound();

  // Проверяем, подавал ли текущий пользователь заявку
  let application = null;
  if (user) {
    const { data } = await supabase
      .from('applications')
      .select('status')
      .eq('event_id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    application = data;
  }

  const isOrganizer = user?.id === event.organizer_id;
  const isApproved = application?.status === 'approved';
  const hasPendingApplication = application?.status === 'pending';
  const canAccessChat = isOrganizer || isApproved || hasPendingApplication;
  const canSeeExactLocation = !event.hide_location || isOrganizer || isApproved;

  return (
    <main className="max-w-[800px] mx-auto px-4 md:px-6 py-10 min-h-screen">
      
      {/* Хлебные крошки / Назад */}
      <Link href="/" className="text-brand-muted font-bold hover:text-brand-accent mb-6 inline-block">
        ← Назад к ленте
      </Link>

      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 md:p-8">
        
        {/* Заголовок и категория */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-[12px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2.5 py-1 rounded border border-brand-cat">
            {event.category}
          </span>
          <span className="text-[14px] font-extrabold bg-brand-bg px-3 py-1 rounded border-2 border-brand-line">
            {new Date(event.date_time).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })} в {new Date(event.date_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{event.title}</h1>

        <div className="flex items-center gap-2.5 text-sm text-brand-muted mb-8 pb-6 border-b-2 border-dashed border-brand-line">
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-cat-soft text-brand-cat border-2 border-brand-cat font-extrabold text-lg uppercase">
            {event.organizer_name.charAt(0)}
          </span>
          <span>
            Организатор: <Link href={`/@${event.organizer_name}`} className="text-brand-text font-bold hover:text-brand-accent transition-colors">{event.organizer_name}</Link>
          </span>
        </div>

        {/* Описание */}
        <h2 className="text-xl font-extrabold mb-2">Описание</h2>
        <p className="text-brand-text mb-8 whitespace-pre-wrap">{event.description}</p>

        {/* Карта и место */}
        <h2 className="text-xl font-extrabold mb-2">Место встречи</h2>
        <p className="font-bold text-brand-muted mb-4">{event.location}</p>
        
        <Map 
          lat={event.lat || 55.751244} 
          lng={event.lng || 37.618423} 
          title={event.title} 
          hideExactLocation={!canSeeExactLocation} 
        />

        {!canSeeExactLocation && (
          <div className="mt-4 p-4 bg-brand-heat/20 border-2 border-brand-heat rounded-brand text-brand-text font-bold text-sm">
            Точное место откроется после того, как организатор подтвердит вашу заявку.
          </div>
        )}

        {/* Действия (если это организатор) */}
        {isOrganizer && (
          <div className="mt-8 p-4 bg-brand-bg border-2 border-brand-line rounded-brand">
            <p className="font-extrabold mb-2">Вы организатор этого события.</p>
            <Link href="/my-events" className="text-brand-accent font-bold underline">Перейти в кабинет для управления заявками</Link>
          </div>
        )}

        {/* Действия (если это участник) */}

        {/* Блок чата (доступен только организатору и подтвержденным) */}
              {canAccessChat && user && (
          <div className="mt-10 border-t-2 border-dashed border-brand-line pt-8">
            <h2 className="text-xl font-extrabold mb-4">Обсуждение</h2>
            <EventChat eventId={event.id} currentUserId={user.id} />
          </div>
        )}

      </div>
    </main>
  );
}
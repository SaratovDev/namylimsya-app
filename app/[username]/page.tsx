import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import EventCard from '@/components/EventCard';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  // Если в URL пришел символ @ (например, /@vadim), мы его просто отрезаем
  const cleanUsername = username.startsWith('@') ? username.slice(1) : username;

  // Ищем профиль по никнейму
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', cleanUsername)
    .single();

  if (!profile) {
    notFound();
  }

  // Ищем события этого пользователя
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_name', cleanUsername)
    .order('date_time', { ascending: true });

  return (
    <main className="max-w-[1280px] mx-auto px-6 py-10">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8 mb-8 text-center">
        <h1 className="text-3xl font-extrabold uppercase mb-2">
          @{profile.username}
        </h1>
        <p className="text-brand-muted font-bold">Организатор событий в «Намылимся»</p>
      </div>

      <h2 className="text-xl font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Созданные события</h2>
      
      <div className="flex flex-col gap-6">
        {(!events || events.length === 0) ? (
          <p className="text-brand-muted font-bold">Этот пользователь пока не создавал событий.</p>
        ) : (
          events.map((event) => (
             <EventCard 
               key={event.id}
               id={event.id} 
               organizerId={event.organizer_id} 
               category={event.category}
               date={new Date(event.date_time).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })}
               countdown="Скоро"
               spots={event.is_full ? 'Мест нет' : `Осталось: ${event.max_participants}`}
               title={event.title}
               description={event.description}
               organizerName={event.organizer_name}
               organizerRank={event.organizer_rank}
               isFull={event.is_full}
             />
          ))
        )}
      </div>
    </main>
  );
}
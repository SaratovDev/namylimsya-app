import { supabase } from '@/lib/supabase';
import EventCard from './EventCard';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' }) + 
    ' · ' + 
    date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export default async function EventList() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date_time', { ascending: true });

  if (error) {
    return <div className="text-red-500 font-bold p-4">Ошибка загрузки</div>;
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
        Пока нет событий. Станьте первым организатором!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          id={event.id} 
          organizerId={event.organizer_id} 
          category={event.category} 
          date={formatDate(event.date_time)} 
          countdown="Скоро" 
          spots={event.is_full ? 'Мест нет' : `Осталось: ${event.max_participants}`} 
          title={event.title} 
          description={event.description} 
          organizerName={event.organizer_name} 
          organizerRank={event.organizer_rank} 
          isFull={event.is_full} 
        />
      ))}
    </div>
  );
}
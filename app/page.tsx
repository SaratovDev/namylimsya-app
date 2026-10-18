import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import EventCard from '@/components/EventCard';
import Sidebar from '@/components/Sidebar';
import CreateEventForm from '@/components/CreateEventForm';

// Выносим форматирование даты
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' }) + 
    ' · ' + 
    date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

// 1. Выносим загрузку данных в отдельный асинхронный компонент
async function EventList() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date_time', { ascending: true });

  if (error) {
    return (
      <div className="p-4 bg-red-100 border-2 border-red-500 rounded text-red-700 font-bold">
        Ошибка загрузки событий. Проверьте консоль.
      </div>
    );
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

// 2. Создаем компонент-заглушку (скелетон), пока данные грузятся
function EventSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-5 h-[250px] animate-pulse">
          <div className="h-6 w-1/3 bg-brand-line/20 mb-4 rounded"></div>
          <div className="h-8 w-3/4 bg-brand-line/20 mb-4 rounded"></div>
          <div className="h-16 w-full bg-brand-line/20 mb-4 rounded"></div>
          <div className="h-10 w-full bg-brand-line/20 rounded"></div>
        </div>
      ))}
    </div>
  );
}

// 3. Главная страница (теперь она не асинхронная и рендерится мгновенно)
export default function Home() {
  return (
    <main className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start mt-6 px-6 pb-12">
      
      <div className="flex flex-col gap-6">
        
        <details className="bg-brand-surface border-2 border-brand-line rounded-brand-lg overflow-hidden">
          <summary className="list-none cursor-pointer flex items-center gap-3 p-5 font-extrabold text-lg uppercase">
            <span className="w-7 h-7 flex items-center justify-center border-2 border-brand-line rounded-full bg-brand-accent text-brand-accent-ink text-xl leading-none">
              +
            </span>
            Создать событие
          </summary>
                    <div className="p-6 border-t-2 border-brand-line">
            <CreateEventForm />
          </div>
        </details>

        {/* 4. Оборачиваем EventList в Suspense */}
        <Suspense fallback={<EventSkeleton />}>
          <EventList />
        </Suspense>

      </div>

      <Sidebar />

    </main>
  );
}
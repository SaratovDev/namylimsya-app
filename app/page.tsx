import { Suspense } from 'react';
import EventList from '@/components/EventList';
import Sidebar from '@/components/Sidebar';
import CreateEventForm from '@/components/CreateEventForm';
import MobileFilters from '@/components/MobileFilters';

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

export default function Home() {
  return (
    <main className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start mt-6 px-4 md:px-6 pb-12 relative">
      
      <div className="flex flex-col gap-6">
        
        <details className="bg-brand-surface border-2 border-brand-line rounded-brand-lg overflow-hidden">
          <summary className="list-none cursor-pointer flex items-center gap-3 p-5 font-extrabold text-lg uppercase">
            <span className="w-7 h-7 flex items-center justify-center border-2 border-brand-line rounded-full bg-brand-accent text-brand-accent-ink text-xl leading-none">+</span>
            Создать событие
          </summary>
          <div className="p-6 border-t-2 border-brand-line">
            <CreateEventForm />
          </div>
        </details>

        {/* Наш новый клиентский компонент для мобильных фильтров */}
        <MobileFilters />

        <Suspense fallback={<EventSkeleton />}>
          <EventList />
        </Suspense>

      </div>

      <div className="hidden lg:block">
        <Sidebar />
      </div>

    </main>
  );
}
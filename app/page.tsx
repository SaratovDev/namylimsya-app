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

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string, category?: string, date_from?: string, date_to?: string }>;
}) {
  return (
    <main className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start mt-6 px-4 md:px-6 pb-12 relative">
      
      <div className="flex flex-col gap-6">
        
        {/* ВОЗВРАЩАЕМ ФОРМУ СОЗДАНИЯ */}
        <details className="bg-brand-surface border-2 border-brand-line rounded-brand-lg overflow-hidden group">
          <summary className="list-none cursor-pointer flex items-center gap-3 p-5 font-extrabold text-lg uppercase hover:bg-brand-bg/50 transition-colors">
            <span className="w-7 h-7 flex items-center justify-center border-2 border-brand-line rounded-full bg-brand-accent text-brand-accent-ink text-xl leading-none group-open:rotate-45 transition-transform duration-300">+</span>
            Создать событие
          </summary>
          <div className="details-content">
            <div className="details-inner">
              <div className="p-6 border-t-2 border-brand-line">
                <CreateEventForm />
              </div>
            </div>
          </div>
        </details>

        <MobileFilters />

        <Suspense fallback={<EventSkeleton />}>
          <EventList searchParams={searchParams} />
        </Suspense>

      </div>

      <div className="hidden lg:block">
        <Suspense fallback={<div className="h-40 bg-brand-surface animate-pulse rounded" />}>
          <Sidebar />
        </Suspense>
      </div>
    </main>
  );
}
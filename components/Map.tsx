'use client';

import dynamic from 'next/dynamic';

// Важно: путь должен быть './MapComponent'
const Map = dynamic(() => import('./MapComponent'), {
  ssr: false, 
  loading: () => (
    <div className="h-64 md:h-80 w-full border-2 border-brand-line rounded-brand bg-brand-bg flex items-center justify-center animate-pulse">
      <span className="font-extrabold text-brand-muted">Загрузка карты...</span>
    </div>
  ),
});

export default Map;
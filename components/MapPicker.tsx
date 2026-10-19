'use client';

import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('./MapPickerComponent'), {
  ssr: false,
  loading: () => <div className="h-64 w-full border-2 border-brand-line rounded-brand bg-brand-bg animate-pulse flex items-center justify-center text-brand-muted font-bold">Загрузка карты...</div>,
});

export default MapPicker;
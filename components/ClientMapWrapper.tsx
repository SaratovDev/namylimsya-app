'use client';

import dynamic from 'next/dynamic';

// Здесь мы говорим Next.js: "не рендери карту на сервере"
const Map = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-48 bg-brand-bg animate-pulse rounded border border-brand-line"></div>
});

export default function ClientMapWrapper(props: any) {
  return <Map {...props} />;
}
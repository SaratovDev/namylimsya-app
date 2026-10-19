'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { useEffect, useState } from 'react';
import L from 'leaflet';

// Фикс для иконок Leaflet в Next.js (иначе маркеры не отображаются)
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  lat?: number;
  lng?: number;
  title: string;
  hideExactLocation?: boolean;
}

export default function Map({ lat = 55.751244, lng = 37.618423, title, hideExactLocation = false }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-64 bg-brand-bg animate-pulse rounded-brand"></div>;

  return (
    <div className="h-64 md:h-80 w-full border-2 border-brand-line rounded-brand overflow-hidden relative z-0">
      <MapContainer 
        center={[lat, lng]} 
        zoom={hideExactLocation ? 12 : 15} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Если место скрыто, показываем просто круг, а не точный маркер */}
        {!hideExactLocation ? (
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>{title}</Popup>
          </Marker>
        ) : (
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>Примерное место встречи. Точное откроется после подтверждения.</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
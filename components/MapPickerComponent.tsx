'use client';

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

function LocationMarker({ onLocationSelect }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`);
        const data = await response.json();
        const address = data.display_name || `Широта: ${lat.toFixed(5)}, Долгота: ${lng.toFixed(5)}`;
        
        onLocationSelect(lat, lng, address);
      } catch (error) {
        console.error("Ошибка геокодинга:", error);
        onLocationSelect(lat, lng, `Широта: ${lat.toFixed(5)}, Долгота: ${lng.toFixed(5)}`);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

// Вспомогательный компонент для программного перемещения карты
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapPickerComponent({ onLocationSelect }: MapPickerProps) {
  // Начальный центр (по умолчанию Москва)
  const [center, setCenter] = useState<[number, number]>([55.751244, 37.618423]);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    // Запрашиваем геолокацию при загрузке карты
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setIsLocating(false);
        },
        (error) => {
          console.warn("Пользователь отклонил геолокацию или произошла ошибка:", error);
          setIsLocating(false); // Оставляем Москву по умолчанию
        }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  return (
    <div className="relative h-64 w-full border-2 border-brand-line rounded-brand overflow-hidden z-0">
      
      {/* Индикатор загрузки геолокации */}
      {isLocating && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-brand-surface border-2 border-brand-line px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-md">
          Определяем ваше местоположение...
        </div>
      )}

      <MapContainer 
        center={center} 
        zoom={11} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
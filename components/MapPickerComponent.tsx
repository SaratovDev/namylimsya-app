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

// Добавляем onCitySelect в пропсы (сделаем его необязательным, чтобы карта не ломалась, если его не передали)
interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  onCitySelect?: (city: string) => void;
}

function LocationMarker({ onLocationSelect, onCitySelect }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`);
        const data = await response.json();
        
        let shortAddress = data.display_name || `Широта: ${lat.toFixed(5)}, Долгота: ${lng.toFixed(5)}`;
        
    // ОБРЕЗАЕМ АДРЕС
        if (data.address) {
          const state = data.address.state || data.address.region || ''; // Область/регион
          const city = data.address.city || data.address.town || data.address.village || '';
          const road = data.address.road || data.address.pedestrian || data.address.footway || '';
          const house = data.address.house_number ? `, ${data.address.house_number}` : '';
          
          // Формируем красивый короткий адрес
          if (road) {
            // Если есть улица, пишем: [Область (если это не город-миллионник), Город, Улица, Дом]
            // Но чтобы не было "Московская область, Москва" (что странно), область добавляем только если город !== область
            const statePrefix = (state && city && state !== city) ? state + ', ' : (state && !city ? state + ', ' : '');
            shortAddress = `${statePrefix}${city ? city + ', ' : ''}${road}${house}`;
          } else if (city) {
            // Если улицы нет (например, кликнули в лес), пишем: [Область, Город/Населенный пункт]
            const statePrefix = (state && state !== city) ? state + ', ' : '';
            shortAddress = `${statePrefix}${city}`;
          } else if (state) {
            // Если вообще ничего нет, кроме области
            shortAddress = state;
          }
          
          // Автоматически подставляем город (или населенный пункт) в форму
          if (city && onCitySelect) {
            onCitySelect(city);
          }
        }
        
        onLocationSelect(lat, lng, shortAddress);
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

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapPickerComponent({ onLocationSelect, onCitySelect }: MapPickerProps) {
  const [center, setCenter] = useState<[number, number]>([55.751244, 37.618423]); // Москва по умолчанию
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const requestGeolocation = () => {
    setIsLocating(true);
    setGeoError(null);

    if (!("geolocation" in navigator)) {
      setGeoError("Ваш браузер не поддерживает геолокацию.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
        setIsLocating(false);
      },
      (error) => {
        console.warn("Ошибка геолокации:", error);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError("Вы заблокировали доступ к геопозиции. Разрешите его в настройках браузера (иконка замка в адресной строке), чтобы карта центрировалась на вас.");
        } else {
          setGeoError("Не удалось определить местоположение. Попробуйте еще раз.");
        }
        setIsLocating(false);
      }
    );
  };

  useEffect(() => {
    // Оборачиваем в setTimeout, чтобы ESLint не ругался на синхронный вызов setState
    const timer = setTimeout(() => {
      requestGeolocation();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col gap-2">
      
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button 
          type="button"
          onClick={requestGeolocation}
          disabled={isLocating}
          className="bg-brand-surface border-2 border-brand-line text-brand-text font-extrabold text-xs uppercase px-3 py-1.5 rounded-brand hover:bg-brand-cat-soft transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
          {isLocating ? 'Определяем...' : 'Моё местоположение'}
        </button>
      </div>

      {geoError && (
        <div className="bg-brand-heat/10 border-2 border-brand-heat p-2 rounded-brand text-[11px] font-bold text-brand-text">
          {geoError}
        </div>
      )}

      <div className="h-64 w-full border-2 border-brand-line rounded-brand overflow-hidden relative z-0">
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
          <LocationMarker onLocationSelect={onLocationSelect} onCitySelect={onCitySelect} />
        </MapContainer>
      </div>
    </div>
  );
}
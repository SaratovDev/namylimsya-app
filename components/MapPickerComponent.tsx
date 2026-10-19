'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
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

export default function MapPickerComponent({ onLocationSelect }: MapPickerProps) {
  return (
    <div className="h-64 w-full border-2 border-brand-line rounded-brand overflow-hidden relative z-0">
      <MapContainer 
        center={[55.751244, 37.618423]} 
        zoom={11} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
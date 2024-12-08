'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Hawaii locations
const locations = [
  { name: "Oahu", position: [21.4389, -158.0001], clients: 89, status: "Primary Hub" },
  { name: "Maui", position: [20.7984, -156.3319], clients: 45, status: "Growing" },
  { name: "Big Island", position: [19.4194, -155.2885], clients: 22, status: "Expanding" },
  { name: "Kauai", position: [22.0964, -159.5261], clients: 0, status: "Coming Soon" }
];

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Fix for default marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-2x.png',
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
    });
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative rounded-lg overflow-hidden h-[400px] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden h-[400px]">
      <MapContainer
        center={[21.3099, -157.8581]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        key={mounted ? 'mounted' : 'loading'}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location) => (
          <Marker
            key={location.name}
            position={location.position as [number, number]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{location.name}</h3>
                <p className="text-sm text-gray-600">{location.clients} clients</p>
                <p className="text-xs text-indigo-600 mt-1">{location.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 
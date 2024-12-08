'use client';

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

// Custom icon
const customIcon = new L.Icon({
  iconUrl: '/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '/marker-shadow.png',
  shadowSize: [41, 41]
});

export default function Map() {
  return (
    <div className="relative rounded-lg overflow-hidden h-[400px]">
      <MapContainer
        center={[21.3099, -157.8581]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location) => (
          <Marker
            key={location.name}
            position={location.position as [number, number]}
            icon={customIcon}
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
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import L from 'leaflet';
import './MapView.css';

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

// Helper to format "time ago"
function timeAgo(createdAt) {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `Shared ${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  const hours = Math.floor(diffMins / 60);
  return `Shared ${hours} hour${hours > 1 ? 's' : ''} ago`;
}

export default function MapView({ foodPins = [], onMapClick }) {
  const [clickMarker, setClickMarker] = useState(null);

  return (
    <div className="map-container">
      <MapContainer center={[20.5937, 78.9629]} zoom={5} className="map-view">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ClickHandler
          onMapClick={(pos) => {
            setClickMarker(pos);
            onMapClick(pos);
          }}
        />

        {clickMarker && (
          <Marker position={[clickMarker.lat, clickMarker.lng]}>
            <Popup>📍 Selected location</Popup>
          </Marker>
        )}

        {foodPins.map((pin, index) => (
          <Marker key={index} position={[pin.lat, pin.lng]}>
            <Popup>
              <div>
                <strong>{pin.description}</strong><br />
                <div>👤 {pin.name}</div>
                <div>📞 {pin.phone}</div>
                <div className="time-info">{timeAgo(pin.createdAt)}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

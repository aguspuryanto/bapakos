
import React, { useEffect, useRef } from 'react';
import { Property } from '../types';
import { useNavigate } from 'react-router-dom';

// Access Leaflet from global window since it's loaded via script tag
declare const L: any;

interface MapOverlayProps {
  properties: Property[];
}

const MapOverlay: React.FC<MapOverlayProps> = ({ properties }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapContainerRef.current || !properties.length) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      // Default center to the first property or Gresik coordinates
      const initialCenter = [properties[0].lat, properties[0].lng];
      mapInstanceRef.current = L.map(mapContainerRef.current).setView(initialCenter, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers (simplified for this context)
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add markers for each property
    properties.forEach((p) => {
      // Create a custom label marker showing price
      const priceK = p.basePrice >= 1000000 
        ? `${(p.basePrice / 1000000).toFixed(1)}jt` 
        : `${(p.basePrice / 1000).toFixed(0)}rb`;

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="custom-price-marker">${priceK}</div>`,
        iconSize: [40, 20],
        iconAnchor: [20, 10]
      });

      const popupContent = `
        <div class="p-1 min-w-[180px]">
          <img src="${p.imageUrl}" class="w-full h-24 object-cover rounded-lg mb-2" />
          <div class="px-1">
            <h4 class="font-bold text-slate-900 text-xs mb-0.5 line-clamp-1">${p.name}</h4>
            <div class="flex items-center gap-1 text-[10px] text-amber-500 font-bold mb-1">
              ⭐ ${p.rating} • ${p.gender}
            </div>
            <p class="text-pink-600 font-extrabold text-sm mb-2">Rp${p.basePrice.toLocaleString('id-ID')}</p>
            <button 
              id="view-detail-${p.id}" 
              class="w-full bg-indigo-600 text-white py-1.5 rounded-md text-[10px] font-bold hover:bg-indigo-700 transition-colors"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      `;

      const marker = L.marker([p.lat, p.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(popupContent, { closeButton: false, minWidth: 200 });

      // Add click event for the detail button in the popup
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-detail-${p.id}`);
        if (btn) {
          btn.onclick = () => {
            navigate(`/property/${p.id}`);
          };
        }
      });
    });

    // Fit bounds to show all markers
    if (properties.length > 1) {
      const bounds = L.latLngBounds(properties.map(p => [p.lat, p.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      // Cleanup map on unmount if needed, but we often keep it for performance
    };
  }, [properties, navigate]);

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[600px] border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Overlay legend or status */}
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-600 border border-slate-200 shadow-sm flex items-center gap-2">
        <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
        Interactive Map Mode
      </div>
    </div>
  );
};

export default MapOverlay;

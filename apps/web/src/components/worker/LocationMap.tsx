import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Custom DivIcon for the Worker's Live Location
const workerLocationIcon = new L.DivIcon({
  className: 'bg-transparent',
  html: `<div style="background-color: #10b981; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(16, 185, 129, 0.8); animation: pulse 2s infinite;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Custom DivIcon for Jobs
const jobIcon = new L.DivIcon({
  className: 'bg-transparent',
  html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

interface LocationMapProps {
  jobs: any[];
  onApply: (job: any) => void;
}

const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
  const map = useMap();
  useEffect(() => {
     map.flyTo([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
};

export function LocationMap({ jobs, onApply }: LocationMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [errorText, setErrorText] = useState("");
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition([marker.getLatLng().lat, marker.getLatLng().lng]);
          setErrorText("Location manually overridden.");
        }
      },
    }),
    []
  );

  useEffect(() => {
    let mounted = true;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
           if (mounted) setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
            console.warn("Geolocation blocked:", err);
            // Fallback if denied
            if (mounted) {
                setPosition([9.9312, 76.2673]); // Kochi Fallback
                setErrorText("Using default Kochi coordinates. Enable GPS for live radar.");
            }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
        if (mounted) setPosition([9.9312, 76.2673]); 
    }
    return () => { mounted = false; };
  }, []);

  if (!position) {
    return (
      <Card className="h-48 border-0 shadow-md bg-secondary/10 flex flex-col items-center justify-center">
         <Loader2 className="animate-spin text-seafoam mb-2" size={24} />
         <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Targeting GPS...</p>
      </Card>
    );
  }

  return (
    <div className="relative h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
      {errorText && (
          <div className="absolute top-2 left-2 right-2 z-[1000] bg-black/80 backdrop-blur-md text-white text-[10px] font-bold p-2 rounded-lg border border-white/10 text-center flex flex-col items-center">
              <span>{errorText}</span>
              <span className="text-emerald-400 mt-0.5">Tip: You can drag your green dot to fix inaccuracy!</span>
          </div>
      )}
      <MapContainer 
         center={position} 
         zoom={14} 
         style={{ height: '100%', width: '100%', background: '#1a1a1a' }}
         zoomControl={false}
         attributionControl={false}
      >
        <TileLayer
            // Using a sleek dark theme openstreetmap variant (CartoDB Dark Matter)
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <RecenterMap lat={position[0]} lng={position[1]} />
        
        {/* Worker Location Marker & Radar Radius */}
        <Marker 
           position={position} 
           icon={workerLocationIcon}
           draggable={true}
           eventHandlers={eventHandlers}
           ref={markerRef}
        >
            <Popup className="custom-popup">
               <div className="font-bold text-xs uppercase text-center p-1">Your Location<br/><span className="text-[9px] text-muted-foreground font-normal">(Drag to adjust if inaccurate)</span></div>
            </Popup>
        </Marker>
        <Circle center={position} radius={3000} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.1, weight: 1, dashArray: '4' }} />

        {/* Dynamic Job Markers */}
        {jobs.map(job => (
             job.latitude && job.longitude ? (
                 <Marker key={job.id} position={[job.latitude, job.longitude]} icon={jobIcon}>
                     <Popup className="rounded-xl overflow-hidden p-0 border-0">
                         <div className="p-3 text-center min-w-[120px]">
                            <p className="font-black text-sm leading-tight text-zinc-900">{job.title}</p>
                            <p className="text-xs font-bold text-seafoam mt-1">₹{job.payPerWorker}</p>
                            <button onClick={() => onApply(job)} className="mt-2 bg-zinc-900 text-white w-full py-1.5 rounded font-bold text-[10px] uppercase">
                                View
                            </button>
                         </div>
                     </Popup>
                 </Marker>
             ) : null
        ))}
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[1000] bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-[9px] uppercase tracking-wider font-bold">
         <MapPin size={10} className="inline mr-1" /> 3km Radius
      </div>
    </div>
  );
}

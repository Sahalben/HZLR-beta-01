import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Custom DivIcon for the Employer's Organization
const employerLocationIcon = new L.DivIcon({
  className: 'bg-transparent',
  html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 4px; border: 3px solid white; box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Custom DivIcon for Available Workers (Seafoam / Emerald)
const workerIcon = new L.DivIcon({
  className: 'bg-transparent',
  html: `<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

interface EmployerLocationMapProps {
  activeWorkers: any[];
}

const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
  const map = useMap();
  useEffect(() => {
     map.flyTo([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
};

export function EmployerLocationMap({ activeWorkers }: EmployerLocationMapProps) {
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
            if(mounted) setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
            console.warn("Geolocation blocked:", err);
            if(mounted) {
                setPosition([9.9312, 76.2673]); // Kochi fallback
                setErrorText("Using default city coordinates for map initialization.");
            }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
        if(mounted) setPosition([9.9312, 76.2673]); 
    }
    return () => { mounted = false; };
  }, []);

  if (!position) {
    return (
      <Card className="h-64 border-0 shadow-md bg-secondary/10 flex flex-col items-center justify-center">
         <Loader2 className="animate-spin text-primary mb-2" size={24} />
         <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Scanning local workforce...</p>
      </Card>
    );
  }

  return (
    <div className="relative h-64 md:h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
      {errorText && (
          <div className="absolute top-2 left-2 right-2 z-[1000] bg-black/80 backdrop-blur-md text-white text-[10px] font-bold p-2 rounded-lg border border-white/10 text-center flex flex-col items-center">
              <span>{errorText}</span>
              <span className="text-emerald-400 mt-0.5">Tip: You can drag your blue dot to your exact building!</span>
          </div>
      )}
      <MapContainer 
         center={position} 
         zoom={13} 
         style={{ height: '100%', width: '100%', background: '#1a1a1a' }}
         zoomControl={false}
         attributionControl={false}
      >
        <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <RecenterMap lat={position[0]} lng={position[1]} />
        
        {/* Employer Location & Recruitment Radar */}
        <Marker 
           position={position} 
           icon={employerLocationIcon}
           draggable={true}
           eventHandlers={eventHandlers}
           ref={markerRef}
        >
            <Popup className="custom-popup">
               <div className="font-bold text-xs uppercase text-center p-1">Your HQ<br/><span className="text-[9px] text-muted-foreground font-normal">(Drag to adjust)</span></div>
            </Popup>
        </Marker>
        <Circle center={position} radius={10000} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.05, weight: 1, dashArray: '4' }} />

        {/* Dynamic Worker Markers */}
        {activeWorkers.map(w => (
             w.latitude && w.longitude ? (
                 <Marker key={w.id} position={[w.latitude, w.longitude]} icon={workerIcon}>
                     <Popup className="rounded-xl overflow-hidden p-0 border-0">
                         <div className="p-3 text-center min-w-[140px]">
                            <p className="font-black text-sm leading-tight text-zinc-900">{w.name}</p>
                            <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-bold text-muted-foreground uppercase">
                                <Activity size={12} className="text-emerald-500" />
                                <span>Score: {w.score ?? 'New'}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1 justify-center">
                               {w.tags?.slice(0,2).map((t: string) => (
                                   <span key={t} className="bg-secondary px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">{t}</span>
                               ))}
                            </div>
                         </div>
                     </Popup>
                 </Marker>
             ) : null
        ))}
      </MapContainer>
      <div className="absolute bottom-3 left-3 z-[1000] bg-black/80 backdrop-blur-md text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-[10px] uppercase tracking-wider font-bold shadow-xl flex items-center gap-2">
         <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
         </span>
         {activeWorkers.length} Available in 10km Network
      </div>
    </div>
  );
}

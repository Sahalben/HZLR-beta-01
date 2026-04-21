import React, { createContext, useContext, useState, useEffect } from 'react';

export type Coordinates = { lat: number; lng: number };

interface LocationContextType {
  coordinates: Coordinates | null;
  addressName: string;
  setCoordinates: (coords: Coordinates) => void;
  setAddressName: (name: string) => void;
  isLoading: boolean;
  detectLocation: () => Promise<void>;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coordinates, setCoordsState] = useState<Coordinates | null>(null);
  const [addressName, setAddrState] = useState<string>('Select Location');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load persisted location from localStorage
    const savedLat = localStorage.getItem('hzlr_loc_lat');
    const savedLng = localStorage.getItem('hzlr_loc_lng');
    const savedName = localStorage.getItem('hzlr_loc_name');
    
    if (savedLat && savedLng && savedName) {
      setCoordsState({ lat: parseFloat(savedLat), lng: parseFloat(savedLng) });
      setAddrState(savedName);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      // Require them to pick a location if not logged/saved
      setIsModalOpen(true);
    }
  }, []);

  const setCoordinates = (coords: Coordinates) => {
    setCoordsState(coords);
    localStorage.setItem('hzlr_loc_lat', coords.lat.toString());
    localStorage.setItem('hzlr_loc_lng', coords.lng.toString());
  };

  const setAddressName = (name: string) => {
    setAddrState(name);
    localStorage.setItem('hzlr_loc_name', name);
  };

  const detectLocation = async () => {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by this browser.'));
        return;
      }
      
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates({ lat, lng });
          
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            const name = data.address?.suburb || data.address?.city_district || data.address?.city || data.address?.town || 'Current Location';
            setAddressName(name);
          } catch {
            setAddressName('Current Location');
          }
          setIsLoading(false);
          setIsModalOpen(false);
          resolve();
        },
        (error) => {
          setIsLoading(false);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  return (
    <LocationContext.Provider 
      value={{ 
        coordinates, 
        addressName, 
        setCoordinates, 
        setAddressName, 
        isLoading, 
        detectLocation, 
        isModalOpen, 
        setIsModalOpen 
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

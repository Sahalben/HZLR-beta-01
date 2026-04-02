import { useState, useCallback } from 'react';

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

interface UseGeolocationReturn extends GeolocationState {
  getCurrentPosition: () => Promise<{ lat: number; lng: number } | null>;
  calculateDistance: (targetLat: number, targetLng: number) => number | null;
}

export function useGeolocation(): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    accuracy: null,
    error: null,
    loading: false,
  });

  const getCurrentPosition = useCallback((): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setState(prev => ({ ...prev, error: 'Geolocation is not supported by your browser', loading: false }));
        resolve(null);
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setState({
            lat: latitude,
            lng: longitude,
            accuracy,
            error: null,
            loading: false,
          });
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access to check in.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          setState(prev => ({ ...prev, error: errorMessage, loading: false }));
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = useCallback((targetLat: number, targetLng: number): number | null => {
    if (state.lat === null || state.lng === null) return null;

    const R = 6371e3; // Earth's radius in meters
    const φ1 = (state.lat * Math.PI) / 180;
    const φ2 = (targetLat * Math.PI) / 180;
    const Δφ = ((targetLat - state.lat) * Math.PI) / 180;
    const Δλ = ((targetLng - state.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // Distance in meters
  }, [state.lat, state.lng]);

  return {
    ...state,
    getCurrentPosition,
    calculateDistance,
  };
}

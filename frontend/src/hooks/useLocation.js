import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const STORAGE_KEY = 'agrisaar_location';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

const DEFAULT_LOCATION = {
  lat: 23.0225,
  lon: 72.5714,
  city: 'Ahmedabad',
  state: 'Gujarat',
  district: 'Ahmedabad',
  country: 'India',
  locationText: 'Ahmedabad, Gujarat'
};

export default function useLocation() {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...JSON.parse(saved), loading: false, error: null };
    } catch {}
    return { ...DEFAULT_LOCATION, loading: true, error: null };
  });

  const reverseGeocode = useCallback(async (lat, lon) => {
    try {
      const res = await fetch(
        `${NOMINATIM_URL}?lat=${lat}&lon=${lon}&format=json&accept-language=en&zoom=12`,
        { headers: { 'User-Agent': 'AgriSaar-SmartFarming/1.0' } }
      );
      if (!res.ok) throw new Error('Geocode failed');
      const data = await res.json();
      const addr = data.address || {};
      
      const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'Unknown';
      const state = addr.state || 'Unknown';
      const district = addr.state_district || addr.county || city;
      const country = addr.country || 'India';

      return { lat, lon, city, state, district, country, locationText: `${city}, ${state}` };
    } catch (err) {
      return { lat, lon, city: 'Unknown', state: 'Unknown', district: 'Unknown', country: 'India', locationText: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E` };
    }
  }, []);

  const getIpLocation = useCallback(async () => {
    try {
      const res = await axios.get('https://ipapi.co/json/');
      if (res.data && res.data.latitude && res.data.longitude) {
        const { latitude, longitude, city, region, country_name } = res.data;
        const finalLoc = { lat: latitude, lon: longitude, city: city || 'Unknown', state: region || 'Unknown', district: city || 'Unknown', country: country_name || 'India', locationText: `${city}, ${region}` };
        setLocation({ ...finalLoc, loading: false, error: null });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalLoc));
        return true;
      }
    } catch (err) {
      console.warn('IP Location fallback failed');
    }
    return false;
  }, []);

  const detectLocation = useCallback(async () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    // Try HTML5 Geolocation First
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
          const geocoded = await reverseGeocode(lat, lon);
          setLocation({ ...geocoded, loading: false, error: null });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(geocoded));
        },
        async (error) => {
          console.warn('Geolocation denied or failed. Trying IP based location...');
          const ipSuccess = await getIpLocation();
          if (!ipSuccess) {
            setLocation({ ...DEFAULT_LOCATION, loading: false, error: 'Using default location' });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LOCATION));
          }
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
      );
    } else {
      const ipSuccess = await getIpLocation();
      if (!ipSuccess) {
        setLocation({ ...DEFAULT_LOCATION, loading: false, error: 'Using default location' });
      }
    }
  }, [reverseGeocode, getIpLocation]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  return { ...location, refresh: detectLocation };
}

import { useState, useEffect } from 'react';
import { mockSafeZones } from '../services/map';

export const useSafeZones = (userLocation) => {
  const [safeZones, setSafeZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSafeZones();
  }, [userLocation]);

  const fetchSafeZones = async () => {
    try {
      setLoading(true);
      // Mock: In production, this would fetch from Supabase
      // and calculate distances based on userLocation
      const zones = mockSafeZones.map(zone => ({
        ...zone,
        distance: userLocation 
          ? calculateDistance(userLocation, zone.coordinates)
          : zone.distance,
      }));
      
      // Sort by distance
      zones.sort((a, b) => a.distance - b.distance);
      
      setSafeZones(zones);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (from, to) => {
    // Simple distance calculation (Haversine formula would be better)
    const R = 6371e3; // Earth radius in meters
    const φ1 = (from.lat * Math.PI) / 180;
    const φ2 = (to[1] * Math.PI) / 180;
    const Δφ = ((to[1] - from.lat) * Math.PI) / 180;
    const Δλ = ((to[0] - from.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  };

  const findNearestSafeZone = () => {
    return safeZones[0] || null;
  };

  const getSafeZoneById = (id) => {
    return safeZones.find(zone => zone.id === id);
  };

  return {
    safeZones,
    loading,
    error,
    findNearestSafeZone,
    getSafeZoneById,
    refresh: fetchSafeZones,
  };
};

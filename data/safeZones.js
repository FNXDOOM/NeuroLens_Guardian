/**
 * Safe Zone Mock Data
 * 
 * Safe Zones are trusted support points such as hospitals, pharmacies,
 * police kiosks, metro help desks, and community support centers.
 */

export const SAFE_ZONE_TYPES = {
  HOSPITAL: 'hospital',
  PHARMACY: 'pharmacy',
  POLICE: 'police',
  METRO_HELP: 'metro_help',
  COMMUNITY_CENTER: 'community_center',
  LIBRARY: 'library',
  FIRE_STATION: 'fire_station',
  GOVERNMENT_OFFICE: 'government_office',
}

export const SAFE_ZONE_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  OPEN_24_7: 'open_24_7',
}

// Mock Safe Zones in Manhattan, NYC area
export const safeZones = [
  {
    id: 'sz-001',
    name: 'NYC Public Library - Main Branch',
    type: SAFE_ZONE_TYPES.LIBRARY,
    latitude: 40.753182,
    longitude: -73.982253,
    address: '476 5th Ave, New York, NY 10018',
    phone: '+1-917-275-6975',
    amenities: ['Seating', 'Restrooms', 'Staff Assistance', 'WiFi', 'Water Fountain', 'Wheelchair Access'],
    open_status: SAFE_ZONE_STATUS.OPEN,
    hours: 'Mon-Sat: 10AM-6PM, Sun: 1PM-5PM',
    accessibility_tags: ['wheelchair_accessible', 'elevator', 'accessible_restroom', 'braille_signage'],
    description: 'Large public library with helpful staff and quiet spaces',
    verified: true,
    rating: 4.8,
  },
  {
    id: 'sz-002',
    name: 'Mount Sinai West Hospital',
    type: SAFE_ZONE_TYPES.HOSPITAL,
    latitude: 40.771209,
    longitude: -73.982345,
    address: '1000 10th Ave, New York, NY 10019',
    phone: '+1-212-523-4000',
    amenities: ['Emergency Care', 'Staff Assistance', 'Restrooms', 'Seating', 'Water Fountain', 'Wheelchair Access'],
    open_status: SAFE_ZONE_STATUS.OPEN_24_7,
    hours: '24/7',
    accessibility_tags: ['wheelchair_accessible', 'elevator', 'accessible_restroom', 'emergency_services'],
    description: 'Full-service hospital with 24/7 emergency care',
    verified: true,
    rating: 4.5,
  },
  {
    id: 'sz-003',
    name: 'CVS Pharmacy - Times Square',
    type: SAFE_ZONE_TYPES.PHARMACY,
    latitude: 40.757500,
    longitude: -73.986000,
    address: '1627 Broadway, New York, NY 10019',
    phone: '+1-212-247-8384',
    amenities: ['Pharmacy', 'Staff Assistance', 'Restrooms', 'Seating', 'Wheelchair Access'],
    open_status: SAFE_ZONE_STATUS.OPEN_24_7,
    hours: '24/7',
    accessibility_tags: ['wheelchair_accessible', 'automatic_doors'],
    description: '24-hour pharmacy with helpful staff',
    verified: true,
    rating: 4.2,
  },
  {
    id: 'sz-004',
    name: 'NYPD Midtown South Precinct',
    type: SAFE_ZONE_TYPES.POLICE,
    latitude: 40.754932,
    longitude: -73.990370,
    address: '357 W 35th St, New York, NY 10001',
    phone: '+1-212-239-9811',
    amenities: ['Police Assistance', 'Emergency Services', 'Restrooms', 'Seating'],
    open_status: SAFE_ZONE_STATUS.OPEN_24_7,
    hours: '24/7',
    accessibility_tags: ['wheelchair_accessible', 'emergency_services'],
    description: 'Police precinct with 24/7 assistance',
    verified: true,
    rating: 4.6,
  },
  {
    id: 'sz-005',
    name: 'Times Square Visitor Center',
    type: SAFE_ZONE_TYPES.COMMUNITY_CENTER,
    latitude: 40.758000,
    longitude: -73.985500,
    address: '1560 Broadway, New York, NY 10036',
    phone: '+1-212-768-1560',
    amenities: ['Information Desk', 'Staff Assistance', 'Restrooms', 'Seating', 'WiFi', 'Wheelchair Access'],
    open_status: SAFE_ZONE_STATUS.OPEN,
    hours: 'Daily: 9AM-7PM',
    accessibility_tags: ['wheelchair_accessible', 'elevator', 'accessible_restroom', 'multilingual_staff'],
    description: 'Tourist information center with multilingual staff',
    verified: true,
    rating: 4.7,
  },
  {
    id: 'sz-006',
    name: 'Port Authority Bus Terminal - Help Desk',
    type: SAFE_ZONE_TYPES.METRO_HELP,
    latitude: 40.757308,
    longitude: -73.989735,
    address: '625 8th Ave, New York, NY 10018',
    phone: '+1-212-564-8484',
    amenities: ['Information Desk', 'Staff Assistance', 'Restrooms', 'Seating', 'Wheelchair Access'],
    open_status: SAFE_ZONE_STATUS.OPEN_24_7,
    hours: '24/7',
    accessibility_tags: ['wheelchair_accessible', 'elevator', 'accessible_restroom'],
    description: 'Major transit hub with 24/7 help desk',
    verified: true,
    rating: 4.0,
  },
  {
    id: 'sz-007',
    name: 'Duane Reade Pharmacy',
    type: SAFE_ZONE_TYPES.PHARMACY,
    latitude: 40.760500,
    longitude: -73.983800,
    address: '1700 Broadway, New York, NY 10019',
    phone: '+1-212-265-2101',
    amenities: ['Pharmacy', 'Staff Assistance', 'Restrooms', 'Seating'],
    open_status: SAFE_ZONE_STATUS.OPEN,
    hours: 'Daily: 7AM-10PM',
    accessibility_tags: ['wheelchair_accessible', 'automatic_doors'],
    description: 'Pharmacy with extended hours',
    verified: true,
    rating: 4.3,
  },
  {
    id: 'sz-008',
    name: 'Bryant Park Information Kiosk',
    type: SAFE_ZONE_TYPES.COMMUNITY_CENTER,
    latitude: 40.753597,
    longitude: -73.983233,
    address: 'Bryant Park, New York, NY 10018',
    phone: '+1-212-768-4242',
    amenities: ['Information Desk', 'Staff Assistance', 'Seating', 'WiFi', 'Restrooms'],
    open_status: SAFE_ZONE_STATUS.OPEN,
    hours: 'Daily: 7AM-10PM',
    accessibility_tags: ['wheelchair_accessible', 'outdoor_seating'],
    description: 'Park information kiosk with helpful staff',
    verified: true,
    rating: 4.6,
  },
  {
    id: 'sz-009',
    name: 'Fire Department - Engine 54',
    type: SAFE_ZONE_TYPES.FIRE_STATION,
    latitude: 40.763500,
    longitude: -73.982000,
    address: '782 8th Ave, New York, NY 10036',
    phone: '+1-212-247-2670',
    amenities: ['Emergency Services', 'Staff Assistance'],
    open_status: SAFE_ZONE_STATUS.OPEN_24_7,
    hours: '24/7',
    accessibility_tags: ['emergency_services'],
    description: 'Fire station with emergency response',
    verified: true,
    rating: 4.9,
  },
  {
    id: 'sz-010',
    name: 'NYC Department of Social Services',
    type: SAFE_ZONE_TYPES.GOVERNMENT_OFFICE,
    latitude: 40.750500,
    longitude: -73.991000,
    address: '109 E 16th St, New York, NY 10003',
    phone: '+1-212-331-6000',
    amenities: ['Staff Assistance', 'Seating', 'Restrooms', 'Wheelchair Access'],
    open_status: SAFE_ZONE_STATUS.OPEN,
    hours: 'Mon-Fri: 9AM-5PM',
    accessibility_tags: ['wheelchair_accessible', 'elevator', 'accessible_restroom', 'multilingual_staff'],
    description: 'Government office providing social services',
    verified: true,
    rating: 4.1,
  },
]

/**
 * Get Safe Zone icon emoji based on type
 */
export function getSafeZoneIcon(type) {
  const icons = {
    [SAFE_ZONE_TYPES.HOSPITAL]: '🏥',
    [SAFE_ZONE_TYPES.PHARMACY]: '💊',
    [SAFE_ZONE_TYPES.POLICE]: '👮',
    [SAFE_ZONE_TYPES.METRO_HELP]: '🚇',
    [SAFE_ZONE_TYPES.COMMUNITY_CENTER]: '🏢',
    [SAFE_ZONE_TYPES.LIBRARY]: '📚',
    [SAFE_ZONE_TYPES.FIRE_STATION]: '🚒',
    [SAFE_ZONE_TYPES.GOVERNMENT_OFFICE]: '🏛️',
  }
  return icons[type] || '📍'
}

/**
 * Get Safe Zone color based on type
 */
export function getSafeZoneColor(type) {
  const colors = {
    [SAFE_ZONE_TYPES.HOSPITAL]: '#ef4444',
    [SAFE_ZONE_TYPES.PHARMACY]: '#10b981',
    [SAFE_ZONE_TYPES.POLICE]: '#3b82f6',
    [SAFE_ZONE_TYPES.METRO_HELP]: '#8b5cf6',
    [SAFE_ZONE_TYPES.COMMUNITY_CENTER]: '#f59e0b',
    [SAFE_ZONE_TYPES.LIBRARY]: '#06b6d4',
    [SAFE_ZONE_TYPES.FIRE_STATION]: '#dc2626',
    [SAFE_ZONE_TYPES.GOVERNMENT_OFFICE]: '#6366f1',
  }
  return colors[type] || '#10b981'
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

/**
 * Find nearest Safe Zone to a given location
 */
export function findNearestSafeZone(userLat, userLng, zones = safeZones) {
  let nearest = null
  let minDistance = Infinity

  zones.forEach(zone => {
    const distance = calculateDistance(userLat, userLng, zone.latitude, zone.longitude)
    if (distance < minDistance) {
      minDistance = distance
      nearest = { ...zone, distance: Math.round(distance) }
    }
  })

  return nearest
}

/**
 * Find Safe Zones within a radius
 */
export function findSafeZonesNearby(userLat, userLng, radiusMeters = 2000, zones = safeZones) {
  return zones
    .map(zone => ({
      ...zone,
      distance: Math.round(calculateDistance(userLat, userLng, zone.latitude, zone.longitude)),
    }))
    .filter(zone => zone.distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Filter Safe Zones by type
 */
export function filterSafeZonesByType(type, zones = safeZones) {
  return zones.filter(zone => zone.type === type)
}

/**
 * Format distance for display
 */
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${meters}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

export default safeZones

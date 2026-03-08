// MapLibre GL JS and MapTiler configuration
// TODO: Add MapTiler API key to .env file

export const MAP_CONFIG = {
  style: 'https://api.maptiler.com/maps/streets/style.json?key=YOUR_MAPTILER_KEY',
  center: [-74.0060, 40.7128], // NYC default
  zoom: 13,
};

export const mapService = {
  initializeMap: (container, options = {}) => {
    // Placeholder for MapLibre initialization
    console.log('Map initialization placeholder', container, options);
    return null;
  },
  
  addMarker: (map, coordinates, options = {}) => {
    // Placeholder for adding markers
    console.log('Add marker placeholder', coordinates, options);
    return null;
  },
  
  drawRoute: (map, coordinates) => {
    // Placeholder for drawing routes
    console.log('Draw route placeholder', coordinates);
    return null;
  },
};

// Mock Safe Zones data
export const mockSafeZones = [
  {
    id: '1',
    name: 'City Pharmacy',
    type: 'pharmacy',
    coordinates: [-74.0060, 40.7128],
    distance: 200,
    support: ['medication', 'seating', 'water'],
    status: 'open',
    accessibility: ['wheelchair', 'restroom'],
    address: '123 Main Street, Downtown',
    phone: '+1234567890',
    hours: 'Mon-Fri: 8:00 AM - 8:00 PM',
  },
  {
    id: '2',
    name: 'Central Hospital',
    type: 'hospital',
    coordinates: [-74.0070, 40.7138],
    distance: 450,
    support: ['emergency care', 'seating', 'water'],
    status: 'open',
    accessibility: ['wheelchair', 'elevator', 'restroom'],
    address: '456 Health Ave, Downtown',
    phone: '+1234567891',
    hours: '24/7',
  },
  {
    id: '3',
    name: 'Police Station North',
    type: 'police',
    coordinates: [-74.0050, 40.7148],
    distance: 650,
    support: ['emergency', 'guidance', 'phone'],
    status: 'open',
    accessibility: ['wheelchair', 'parking'],
    address: '789 Safety Blvd, Downtown',
    phone: '911',
    hours: '24/7',
  },
];

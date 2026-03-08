// OpenRouteService configuration
// TODO: Add OpenRouteService API key to .env file

export const ROUTING_CONFIG = {
  apiKey: 'YOUR_OPENROUTESERVICE_KEY',
  baseUrl: 'https://api.openrouteservice.org/v2',
};

export const routingService = {
  getRoute: async (start, end, profile = 'foot-walking') => {
    // Mock route data
    return {
      distance: 1200, // meters
      duration: 900, // seconds
      coordinates: [
        start,
        [start[0] + 0.001, start[1] + 0.001],
        [start[0] + 0.002, start[1] + 0.002],
        end,
      ],
      instructions: [
        { text: 'Head north on Main St', distance: 200, duration: 150 },
        { text: 'Turn right onto 5th Ave', distance: 500, duration: 375 },
        { text: 'Turn left onto Park St', distance: 300, duration: 225 },
        { text: 'Arrive at destination', distance: 200, duration: 150 },
      ],
    };
  },
  
  getNearbyPOIs: async (coordinates, radius = 500) => {
    // Mock nearby points of interest
    return [
      { name: 'Coffee Shop', type: 'cafe', distance: 150 },
      { name: 'Bus Stop', type: 'transit', distance: 80 },
      { name: 'Park', type: 'leisure', distance: 300 },
    ];
  },
};

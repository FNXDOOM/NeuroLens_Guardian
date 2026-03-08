/**
 * MapTiler and MapLibre GL JS Configuration
 * 
 * This module provides reusable helpers for map initialization,
 * styling, and common map operations using MapTiler tiles.
 * 
 * @module services/maps
 */

// Validate MapTiler API key
const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY

if (!MAPTILER_API_KEY) {
  console.warn('MapTiler API key is missing. Map features will not work.')
}

/**
 * MapTiler style URLs
 * Available styles: streets, basic, bright, pastel, positron, hybrid, topo, voyager
 */
export const MAP_STYLES = {
  streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`,
  basic: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_API_KEY}`,
  bright: `https://api.maptiler.com/maps/bright-v2/style.json?key=${MAPTILER_API_KEY}`,
  pastel: `https://api.maptiler.com/maps/pastel/style.json?key=${MAPTILER_API_KEY}`,
  positron: `https://api.maptiler.com/maps/positron/style.json?key=${MAPTILER_API_KEY}`,
  hybrid: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_API_KEY}`,
  topo: `https://api.maptiler.com/maps/topo-v2/style.json?key=${MAPTILER_API_KEY}`,
  voyager: `https://api.maptiler.com/maps/voyager-v2/style.json?key=${MAPTILER_API_KEY}`,
}

/**
 * Default map configuration
 */
export const DEFAULT_MAP_CONFIG = {
  style: MAP_STYLES.streets,
  center: [-74.006, 40.7128], // NYC default [lng, lat]
  zoom: 13,
  pitch: 0,
  bearing: 0,
  attributionControl: true,
  logoPosition: 'bottom-left',
}

/**
 * Map initialization helper
 * 
 * @param {string|HTMLElement} container - Container element or ID
 * @param {Object} options - Map options (overrides defaults)
 * @returns {Object} MapLibre GL JS map instance
 * 
 * @example
 * const map = initializeMap('map-container', {
 *   center: [-73.9855, 40.7580],
 *   zoom: 15
 * })
 */
export const initializeMap = (container, options = {}) => {
  if (typeof window === 'undefined') {
    console.warn('Map can only be initialized in browser environment')
    return null
  }

  // Dynamic import of maplibre-gl to avoid SSR issues
  // Note: Install with: npm install maplibre-gl
  try {
    const maplibregl = require('maplibre-gl')
    
    const mapConfig = {
      ...DEFAULT_MAP_CONFIG,
      ...options,
      container: typeof container === 'string' ? container : container,
    }

    const map = new maplibregl.Map(mapConfig)

    // Add navigation controls
    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
      }),
      'top-right'
    )

    // Add geolocate control
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-right'
    )

    return map
  } catch (error) {
    console.error('Failed to initialize map:', error)
    return null
  }
}

/**
 * Marker helpers
 */
export const markers = {
  /**
   * Create a marker on the map
   * 
   * @param {Object} map - MapLibre map instance
   * @param {Array} coordinates - [lng, lat]
   * @param {Object} options - Marker options
   * @returns {Object} Marker instance
   * 
   * @example
   * const marker = markers.create(map, [-73.9855, 40.7580], {
   *   color: '#FF0000',
   *   draggable: false
   * })
   */
  create: (map, coordinates, options = {}) => {
    if (!map || typeof window === 'undefined') return null

    try {
      const maplibregl = require('maplibre-gl')
      
      const marker = new maplibregl.Marker({
        color: options.color || '#3b82f6',
        draggable: options.draggable || false,
        ...options,
      })
        .setLngLat(coordinates)
        .addTo(map)

      if (options.popup) {
        const popup = new maplibregl.Popup({ offset: 25 })
          .setHTML(options.popup)
        marker.setPopup(popup)
      }

      return marker
    } catch (error) {
      console.error('Failed to create marker:', error)
      return null
    }
  },

  /**
   * Create a custom HTML marker
   * 
   * @param {Object} map - MapLibre map instance
   * @param {Array} coordinates - [lng, lat]
   * @param {string|HTMLElement} element - HTML element or string
   * @param {Object} options - Marker options
   * @returns {Object} Marker instance
   */
  createCustom: (map, coordinates, element, options = {}) => {
    if (!map || typeof window === 'undefined') return null

    try {
      const maplibregl = require('maplibre-gl')
      
      const el = typeof element === 'string' 
        ? createElementFromHTML(element)
        : element

      const marker = new maplibregl.Marker({
        element: el,
        ...options,
      })
        .setLngLat(coordinates)
        .addTo(map)

      return marker
    } catch (error) {
      console.error('Failed to create custom marker:', error)
      return null
    }
  },

  /**
   * Remove marker from map
   * 
   * @param {Object} marker - Marker instance
   */
  remove: (marker) => {
    if (marker) {
      marker.remove()
    }
  },
}

/**
 * Route visualization helpers
 */
export const routes = {
  /**
   * Draw a route on the map
   * 
   * @param {Object} map - MapLibre map instance
   * @param {Array} coordinates - Array of [lng, lat] coordinates
   * @param {Object} options - Route styling options
   * @returns {string} Layer ID
   * 
   * @example
   * const layerId = routes.draw(map, [
   *   [-73.9855, 40.7580],
   *   [-73.9865, 40.7590]
   * ], { color: '#3b82f6', width: 4 })
   */
  draw: (map, coordinates, options = {}) => {
    if (!map || !coordinates || coordinates.length < 2) return null

    const layerId = options.id || `route-${Date.now()}`
    const sourceId = `${layerId}-source`

    try {
      // Add source
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      })

      // Add layer
      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': options.color || '#3b82f6',
          'line-width': options.width || 4,
          'line-opacity': options.opacity || 0.8,
        },
      })

      return layerId
    } catch (error) {
      console.error('Failed to draw route:', error)
      return null
    }
  },

  /**
   * Remove route from map
   * 
   * @param {Object} map - MapLibre map instance
   * @param {string} layerId - Layer ID to remove
   */
  remove: (map, layerId) => {
    if (!map || !layerId) return

    try {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId)
      }
      if (map.getSource(`${layerId}-source`)) {
        map.removeSource(`${layerId}-source`)
      }
    } catch (error) {
      console.error('Failed to remove route:', error)
    }
  },

  /**
   * Fit map bounds to route
   * 
   * @param {Object} map - MapLibre map instance
   * @param {Array} coordinates - Array of [lng, lat] coordinates
   * @param {Object} options - Fit bounds options
   */
  fitBounds: (map, coordinates, options = {}) => {
    if (!map || !coordinates || coordinates.length === 0) return

    try {
      const maplibregl = require('maplibre-gl')
      
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord)
      }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]))

      map.fitBounds(bounds, {
        padding: options.padding || 50,
        maxZoom: options.maxZoom || 16,
        duration: options.duration || 1000,
      })
    } catch (error) {
      console.error('Failed to fit bounds:', error)
    }
  },
}

/**
 * Safe Zone marker helpers
 */
export const safeZones = {
  /**
   * Add Safe Zone markers to map
   * 
   * @param {Object} map - MapLibre map instance
   * @param {Array} zones - Array of Safe Zone objects
   * @returns {Array} Array of marker instances
   * 
   * @example
   * const markers = safeZones.addMarkers(map, [
   *   { id: '1', name: 'Hospital', type: 'hospital', coordinates: [-73.9855, 40.7580] }
   * ])
   */
  addMarkers: (map, zones) => {
    if (!map || !zones) return []

    const markerInstances = []

    zones.forEach((zone) => {
      const color = getSafeZoneColor(zone.type)
      const icon = getSafeZoneIcon(zone.type)

      const el = document.createElement('div')
      el.className = 'safe-zone-marker'
      el.style.cssText = `
        width: 40px;
        height: 40px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      `
      el.innerHTML = icon

      const marker = markers.createCustom(
        map,
        zone.coordinates,
        el,
        {
          popup: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${zone.name}</h3>
              <p style="margin: 0; font-size: 14px; color: #666;">${zone.type}</p>
              ${zone.distance ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #999;">${zone.distance}m away</p>` : ''}
            </div>
          `,
        }
      )

      markerInstances.push(marker)
    })

    return markerInstances
  },
}

/**
 * Utility functions
 */

const createElementFromHTML = (htmlString) => {
  const div = document.createElement('div')
  div.innerHTML = htmlString.trim()
  return div.firstChild
}

const getSafeZoneColor = (type) => {
  const colors = {
    hospital: '#ef4444',
    pharmacy: '#22c55e',
    police: '#3b82f6',
    kiosk: '#a855f7',
    community: '#f97316',
  }
  return colors[type] || '#6b7280'
}

const getSafeZoneIcon = (type) => {
  const icons = {
    hospital: '🏥',
    pharmacy: '💊',
    police: '🚔',
    kiosk: 'ℹ️',
    community: '🏢',
  }
  return icons[type] || '📍'
}

/**
 * Get MapTiler static map URL
 * 
 * @param {Object} options - Static map options
 * @returns {string} Static map image URL
 * 
 * @example
 * const url = getStaticMapUrl({
 *   center: [-73.9855, 40.7580],
 *   zoom: 14,
 *   width: 600,
 *   height: 400
 * })
 */
export const getStaticMapUrl = (options = {}) => {
  const {
    center = [0, 0],
    zoom = 13,
    width = 600,
    height = 400,
    style = 'streets-v2',
    markers = [],
  } = options

  let url = `https://api.maptiler.com/maps/${style}/static/${center[0]},${center[1]},${zoom}/${width}x${height}.png?key=${MAPTILER_API_KEY}`

  // Add markers if provided
  if (markers.length > 0) {
    const markerString = markers
      .map((m) => `${m.lng},${m.lat}`)
      .join('|')
    url += `&markers=${markerString}`
  }

  return url
}

export default {
  MAP_STYLES,
  DEFAULT_MAP_CONFIG,
  initializeMap,
  markers,
  routes,
  safeZones,
  getStaticMapUrl,
}

'use client'

/**
 * LiveMap Component
 * 
 * A reusable map component using MapLibre GL JS with MapTiler styles.
 * Displays user location, Safe Zones, routes, and hazards.
 * 
 * @component
 */

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

/**
 * LiveMap Component
 * @param {Object} props
 * @param {Object} [props.center] - Initial map center {lng, lat}
 * @param {number} [props.zoom] - Initial zoom level
 * @param {string} [props.style] - Map style (streets, satellite, outdoor, etc.)
 * @param {Object} [props.userLocation] - User location {lng, lat}
 * @param {Array} [props.safeZones] - Array of Safe Zone markers
 * @param {Array} [props.hazards] - Array of hazard markers
 * @param {Array} [props.route] - Route coordinates [[lng, lat], ...]
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onMapLoad] - Callback when map loads
 */
export default function LiveMap({
  center = { lng: -73.985500, lat: 40.758000 }, // Times Square, NYC
  zoom = 14,
  style = 'streets',
  userLocation = null,
  safeZones = [],
  hazards = [],
  route = [],
  className = '',
  onMapLoad = null,
}) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const userMarker = useRef(null)
  const safeZoneMarkers = useRef([])
  const hazardMarkers = useRef([])
  
  const [mapLoaded, setMapLoaded] = useState(false)

  // Get MapTiler API key from environment
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY

  // Map style URLs
  const styleUrls = {
    streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
    satellite: `https://api.maptiler.com/maps/hybrid/style.json?key=${apiKey}`,
    outdoor: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${apiKey}`,
    basic: `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`,
    bright: `https://api.maptiler.com/maps/bright-v2/style.json?key=${apiKey}`,
    pastel: `https://api.maptiler.com/maps/pastel/style.json?key=${apiKey}`,
    topo: `https://api.maptiler.com/maps/topo-v2/style.json?key=${apiKey}`,
    winter: `https://api.maptiler.com/maps/winter-v2/style.json?key=${apiKey}`,
  }

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Create map instance
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrls[style] || styleUrls.streets,
      center: [center.lng, center.lat],
      zoom: zoom,
      attributionControl: true,
    })

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    )

    // Add scale control
    map.current.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      }),
      'bottom-left'
    )

    // Handle map load
    map.current.on('load', () => {
      setMapLoaded(true)
      if (onMapLoad) {
        onMapLoad(map.current)
      }
    })

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Update user location marker
  useEffect(() => {
    if (!mapLoaded || !map.current) return

    // Remove existing marker
    if (userMarker.current) {
      userMarker.current.remove()
    }

    // Add new marker if location provided
    if (userLocation) {
      // Create custom marker element
      const el = document.createElement('div')
      el.className = 'user-location-marker'
      el.style.width = '32px'
      el.style.height = '32px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = '#3b82f6'
      el.style.border = '4px solid white'
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
      el.style.cursor = 'pointer'

      // Add pulsing animation
      const pulse = document.createElement('div')
      pulse.style.position = 'absolute'
      pulse.style.top = '50%'
      pulse.style.left = '50%'
      pulse.style.transform = 'translate(-50%, -50%)'
      pulse.style.width = '100%'
      pulse.style.height = '100%'
      pulse.style.borderRadius = '50%'
      pulse.style.backgroundColor = 'rgba(59, 130, 246, 0.3)'
      pulse.style.animation = 'pulse 2s infinite'
      el.appendChild(pulse)

      // Create marker
      userMarker.current = new maplibregl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(
            '<div style="padding: 8px;"><strong>Your Location</strong></div>'
          )
        )
        .addTo(map.current)

      // Center map on user location
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 15,
        duration: 1000,
      })
    }
  }, [mapLoaded, userLocation])

  // Update Safe Zone markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return

    // Remove existing markers
    safeZoneMarkers.current.forEach(marker => marker.remove())
    safeZoneMarkers.current = []

    // Add new markers
    safeZones.forEach(zone => {
      // Create custom marker element
      const el = document.createElement('div')
      el.className = 'safe-zone-marker'
      el.style.width = '28px'
      el.style.height = '28px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = '#10b981'
      el.style.border = '3px solid white'
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)'
      el.style.cursor = 'pointer'
      el.style.display = 'flex'
      el.style.alignItems = 'center'
      el.style.justifyContent = 'center'
      el.style.fontSize = '14px'
      el.innerHTML = '🏥'

      // Create popup content
      const popupContent = `
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
            ${zone.name || 'Safe Zone'}
          </h3>
          ${zone.type ? `<p style="margin: 4px 0; font-size: 12px; color: #666;">Type: ${zone.type}</p>` : ''}
          ${zone.distance ? `<p style="margin: 4px 0; font-size: 12px; color: #666;">Distance: ${zone.distance}m</p>` : ''}
          ${zone.status ? `<p style="margin: 4px 0; font-size: 12px;"><span style="color: ${zone.status === 'open' ? '#10b981' : '#ef4444'};">● ${zone.status}</span></p>` : ''}
        </div>
      `

      // Create marker
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([zone.lng, zone.lat])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map.current)

      safeZoneMarkers.current.push(marker)
    })
  }, [mapLoaded, safeZones])

  // Update hazard markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return

    // Remove existing markers
    hazardMarkers.current.forEach(marker => marker.remove())
    hazardMarkers.current = []

    // Add new markers
    hazards.forEach(hazard => {
      // Determine color based on severity
      const severityColors = {
        low: '#fbbf24',
        medium: '#f59e0b',
        high: '#ef4444',
        critical: '#dc2626',
      }
      const color = severityColors[hazard.severity] || '#f59e0b'

      // Create custom marker element
      const el = document.createElement('div')
      el.className = 'hazard-marker'
      el.style.width = '24px'
      el.style.height = '24px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = color
      el.style.border = '2px solid white'
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)'
      el.style.cursor = 'pointer'
      el.style.display = 'flex'
      el.style.alignItems = 'center'
      el.style.justifyContent = 'center'
      el.style.fontSize = '12px'
      el.innerHTML = '⚠️'

      // Create popup content
      const popupContent = `
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
            ${hazard.type || 'Hazard Detected'}
          </h3>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">
            Severity: <span style="color: ${color}; font-weight: 600;">${hazard.severity}</span>
          </p>
          ${hazard.distance ? `<p style="margin: 4px 0; font-size: 12px; color: #666;">Distance: ${hazard.distance}m</p>` : ''}
          ${hazard.confidence ? `<p style="margin: 4px 0; font-size: 12px; color: #666;">Confidence: ${hazard.confidence}%</p>` : ''}
          ${hazard.description ? `<p style="margin: 8px 0 0 0; font-size: 12px;">${hazard.description}</p>` : ''}
        </div>
      `

      // Create marker
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([hazard.lng, hazard.lat])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map.current)

      hazardMarkers.current.push(marker)
    })
  }, [mapLoaded, hazards])

  // Update route
  useEffect(() => {
    if (!mapLoaded || !map.current || route.length === 0) return

    // Remove existing route layer
    if (map.current.getLayer('route')) {
      map.current.removeLayer('route')
    }
    if (map.current.getSource('route')) {
      map.current.removeSource('route')
    }

    // Add route source and layer
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route,
        },
      },
    })

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4,
        'line-opacity': 0.8,
      },
    })

    // Fit map to route bounds
    const bounds = route.reduce(
      (bounds, coord) => bounds.extend(coord),
      new maplibregl.LngLatBounds(route[0], route[0])
    )
    map.current.fitBounds(bounds, { padding: 50 })
  }, [mapLoaded, route])

  return (
    <>
      <div
        ref={mapContainer}
        className={`w-full h-full rounded-lg overflow-hidden ${className}`}
        style={{ minHeight: '400px' }}
      />
      
      {/* Add CSS for pulse animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}

'use client'

/**
 * 3D AR Glasses Simulation using Three.js
 * Demonstrates NeuroLens Guardian through smart AR glasses
 */

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Road/Path Component
 */
function Road() {
  return (
    <group>
      {/* Main road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[8, 50]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Road markings */}
      {[...Array(10)].map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.05, -5 + i * 5]}
        >
          <planeGeometry args={[0.3, 2]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
      ))}
      
      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, -0.1, 0]}>
        <planeGeometry args={[2, 50]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, -0.1, 0]}>
        <planeGeometry args={[2, 50]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    </group>
  )
}

/**
 * Vehicle Hazard
 */
function Vehicle({ position, color = '#ff0000' }) {
  return (
    <group position={position}>
      {/* Car body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.8, 1, 3.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Car top */}
      <mesh position={[0, 1.2, -0.3]}>
        <boxGeometry args={[1.6, 0.8, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Warning indicator */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

/**
 * Pedestrian Hazard
 */
function Pedestrian({ position }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      {/* Warning indicator */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

/**
 * Obstacle
 */
function Obstacle({ position, type = 'box' }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
      {/* Warning indicator */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}

/**
 * Safe Zone Marker
 */
function SafeZoneMarker({ position, distance }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime
    }
  })
  
  return (
    <group position={position}>
      {/* Base platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.3} />
      </mesh>
      
      {/* Marker pillar */}
      <mesh ref={meshRef} position={[0, 2, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 4, 8]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1} />
      </mesh>
      
      {/* Top sphere */}
      <mesh position={[0, 4.5, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
      </mesh>
      
      {/* Distance text */}
      <Text
        position={[0, 5.5, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {distance}m
      </Text>
    </group>
  )
}

/**
 * Direction Arrow
 */
function DirectionArrow({ position, direction = 'forward' }) {
  const arrowRef = useRef()
  
  useFrame((state) => {
    if (arrowRef.current) {
      arrowRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })
  
  return (
    <group ref={arrowRef} position={position}>
      {/* Arrow shaft */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} />
      </mesh>
      {/* Arrow head */}
      <mesh position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

/**
 * Warning Sign Component - Shows hazard-specific warnings
 */
function WarningSign({ position, type, message }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + 2.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })
  
  const getSignColor = () => {
    switch (type) {
      case 'danger': return '#dc2626'
      case 'caution': return '#f59e0b'
      case 'warning': return '#eab308'
      default: return '#3b82f6'
    }
  }
  
  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <meshStandardMaterial 
          color={getSignColor()} 
          emissive={getSignColor()} 
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <circleGeometry args={[0.3, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {message && (
        <Text
          position={[0, -0.3, 0.06]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.3}
        >
          {message}
        </Text>
      )}
    </group>
  )
}

/**
 * Movement Arrow - Shows directional guidance based on AR detections
 */
function MovementArrow({ position, direction, urgency, message }) {
  const arrowRef = useRef()
  
  useFrame((state) => {
    if (arrowRef.current) {
      arrowRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.15
    }
  })
  
  const getRotation = () => {
    switch (direction) {
      case 'left': return [0, Math.PI / 2, 0]
      case 'right': return [0, -Math.PI / 2, 0]
      case 'back': return [0, Math.PI, 0]
      default: return [0, 0, 0]
    }
  }
  
  const getColor = () => {
    switch (urgency) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      default: return '#3b82f6'
    }
  }
  
  return (
    <group ref={arrowRef} position={position} rotation={getRotation()}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 2, 8]} />
        <meshStandardMaterial 
          color={getColor()} 
          emissive={getColor()} 
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[0, 0, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.4, 0.8, 8]} />
        <meshStandardMaterial 
          color={getColor()} 
          emissive={getColor()} 
          emissiveIntensity={1.5}
        />
      </mesh>
      {message && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {message}
        </Text>
      )}
    </group>
  )
}

/**
 * Main 3D Scene
 */
function Scene({ scenario, mode, distressState, simulationState }) {
  // Determine what to show based on scenario or simulation state
  const hazardMarkers = simulationState?.hazardMarkers || []
  const movementRecommendation = simulationState?.movementRecommendation
  
  // Legacy scenario-based rendering (for backward compatibility)
  const showVehicle = scenario === 'vehicle' || scenario === 'crowded'
  const showPedestrianLeft = scenario === 'obstacle-left' || scenario === 'crowded'
  const showPedestrianRight = scenario === 'obstacle-right' || scenario === 'crowded'
  const showObstacle = scenario === 'crowded'
  
  // Use simulation state if available
  const showSafeZone = simulationState?.safeZoneMarker?.visible || 
                       scenario === 'safe-zone' || 
                       mode === 'navigation' || 
                       distressState === 'distress'
  const showDirectionArrow = mode === 'navigation' || scenario === 'safe-zone'
  
  // Show movement arrow if there's a recommendation from AR detection
  const showMovementArrow = movementRecommendation && 
                           movementRecommendation.action !== 'continue' &&
                           hazardMarkers.length > 0
  
  // Show warning signs for high-severity hazards
  const highSeverityHazards = hazardMarkers.filter(h => h.severity === 'danger')
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      
      {/* Road */}
      <Road />
      
      {/* Hazards from simulation state (AR detections) */}
      {hazardMarkers.length > 0 ? (
        hazardMarkers.map((marker) => {
          if (marker.type === 'vehicle') {
            return <Vehicle key={marker.id} position={marker.position} color={marker.color} />
          } else if (marker.type === 'person') {
            return <Pedestrian key={marker.id} position={marker.position} />
          } else {
            return <Obstacle key={marker.id} position={marker.position} />
          }
        })
      ) : (
        // Legacy scenario-based hazards
        <>
          {showVehicle && (
            <Vehicle position={[0, 0, -8]} color={distressState === 'emergency' ? '#dc2626' : '#ef4444'} />
          )}
          
          {showPedestrianLeft && (
            <Pedestrian position={[-3, 0, -6]} />
          )}
          
          {showPedestrianRight && (
            <Pedestrian position={[3, 0, -7]} />
          )}
          
          {showObstacle && (
            <Obstacle position={[1, 0, -10]} />
          )}
        </>
      )}
      
      {/* Warning Signs for high-severity hazards */}
      {highSeverityHazards.map((hazard) => (
        <WarningSign
          key={`warning-${hazard.id}`}
          position={[hazard.position[0], 0, hazard.position[2] + 2]}
          type={hazard.severity}
          message={hazard.label.toUpperCase()}
        />
      ))}
      
      {/* Movement Arrow based on AR detection */}
      {showMovementArrow && (
        <MovementArrow
          position={[0, 1.5, -4]}
          direction={movementRecommendation.direction}
          urgency={movementRecommendation.urgency}
          message={movementRecommendation.message}
        />
      )}
      
      {/* Safe Zone */}
      {showSafeZone && (
        <SafeZoneMarker 
          position={simulationState?.safeZoneMarker?.position || [0, 0, -20]} 
          distance={simulationState?.safeZoneDistance || 150} 
        />
      )}
      
      {/* Direction Arrow (legacy navigation) */}
      {showDirectionArrow && !showMovementArrow && (
        <DirectionArrow position={[0, 1.5, -3]} />
      )}
      
      {/* Grid helper (optional) */}
      {process.env.NODE_ENV === 'development' && (
        <gridHelper args={[50, 50, '#444444', '#222222']} />
      )}
    </>
  )
}

/**
 * HUD Overlay Component
 */
function HUDOverlay({ mode, distressState, scenario, hazardCount, safeZoneDistance, guidanceMessage, guardianNotified }) {
  const getModeColor = () => {
    switch (mode) {
      case 'navigation': return 'bg-blue-500'
      case 'hazard': return 'bg-yellow-500'
      case 'distress': return 'bg-orange-500'
      case 'emergency': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }
  
  const getDistressColor = () => {
    switch (distressState) {
      case 'safe': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'distress': return 'text-orange-400'
      case 'emergency': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          {/* Mode indicator */}
          <div className={`${getModeColor()} px-4 py-2 rounded-lg text-white font-bold text-sm`}>
            {mode.toUpperCase()} MODE
          </div>
          
          {/* Status */}
          <div className={`${getDistressColor()} font-bold text-lg`}>
            {distressState.toUpperCase()}
          </div>
          
          {/* Guardian notification */}
          {guardianNotified && (
            <div className="bg-purple-500 px-4 py-2 rounded-lg text-white font-bold text-sm animate-pulse">
              GUARDIAN NOTIFIED
            </div>
          )}
        </div>
      </div>
      
      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white/70 rounded-full"></div>
        </div>
      </div>
      
      {/* Left side info */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 space-y-4">
        {/* Hazard count */}
        {hazardCount > 0 && (
          <div className="bg-red-500/80 px-4 py-3 rounded-lg text-white">
            <div className="text-2xl font-bold">{hazardCount}</div>
            <div className="text-xs">HAZARDS</div>
          </div>
        )}
        
        {/* Safe Zone distance */}
        {safeZoneDistance && (
          <div className="bg-green-500/80 px-4 py-3 rounded-lg text-white">
            <div className="text-2xl font-bold">{safeZoneDistance}m</div>
            <div className="text-xs">TO SAFE ZONE</div>
          </div>
        )}
      </div>
      
      {/* Right side direction */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        {mode === 'navigation' && (
          <div className="bg-blue-500/80 px-6 py-4 rounded-lg text-white text-center">
            <div className="text-4xl mb-2">↑</div>
            <div className="text-sm font-bold">CONTINUE</div>
            <div className="text-xs">STRAIGHT</div>
          </div>
        )}
      </div>
      
      {/* Bottom guidance strip */}
      {guidanceMessage && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="bg-black/60 backdrop-blur-sm px-6 py-4 rounded-lg text-white text-center">
            <div className="text-sm font-medium">{guidanceMessage}</div>
          </div>
        </div>
      )}
      
      {/* Emergency overlay */}
      {distressState === 'emergency' && (
        <div className="absolute inset-0 border-8 border-red-500 animate-pulse pointer-events-none"></div>
      )}
    </div>
  )
}

/**
 * Main AR Glasses 3D Scene Component
 */
export default function ARGlasses3DScene({
  // Legacy props (for backward compatibility)
  mode = 'navigation',
  distressState = 'safe',
  scenario = 'clear',
  hazardCount = 0,
  safeZoneDistance = null,
  guidanceMessage = '',
  guardianNotified = false,
  enableControls = false,
  
  // New: simulation state from adapter
  simulationState = null,
  onError = null,
}) {
  // Use simulation state if provided, otherwise fall back to legacy props
  const effectiveMode = simulationState?.simulationMode || mode
  const effectiveDistressState = simulationState?.distressStatus || distressState
  const effectiveScenario = scenario // Keep scenario for demo mode
  const effectiveHazardCount = simulationState?.hazardMarkers?.length || hazardCount
  const effectiveSafeZoneDistance = simulationState?.safeZoneDistance || safeZoneDistance
  const effectiveGuidanceMessage = simulationState?.hudMessage || guidanceMessage
  const effectiveGuardianNotified = simulationState?.guardianState?.notified || guardianNotified
  
  // Error boundary
  useEffect(() => {
    const handleError = (event) => {
      if (event.message?.includes('WebGL') || event.message?.includes('three')) {
        if (onError) {
          onError(new Error('WebGL not supported'))
        }
      }
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [onError])
  
  return (
    <div className="relative w-full h-full bg-black">
      {/* Three.js Canvas */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1.6, 5]} fov={75} />
        
        <Scene 
          scenario={effectiveScenario}
          mode={effectiveMode}
          distressState={effectiveDistressState}
          simulationState={simulationState}
        />
        
        {enableControls && <OrbitControls />}
      </Canvas>
      
      {/* HUD Overlay */}
      <HUDOverlay
        mode={effectiveMode}
        distressState={effectiveDistressState}
        scenario={effectiveScenario}
        hazardCount={effectiveHazardCount}
        safeZoneDistance={effectiveSafeZoneDistance}
        guidanceMessage={effectiveGuidanceMessage}
        guardianNotified={effectiveGuardianNotified}
      />
    </div>
  )
}

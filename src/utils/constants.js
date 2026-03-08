// Application constants

export const USER_ROLES = {
  USER: 'user',
  CAREGIVER: 'caregiver',
  ADMIN: 'admin',
};

export const ALERT_TYPES = {
  OBSTACLE: 'obstacle',
  ROUTE_DEVIATION: 'route',
  DISTRESS: 'distress',
  EMERGENCY: 'emergency',
  SAFE_ZONE: 'safe_zone',
  TRANSPORT: 'transport',
};

export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const DETECTION_STATUS = {
  DANGER: 'danger',
  CAUTION: 'caution',
  SAFE: 'safe',
};

export const SAFE_ZONE_TYPES = {
  HOSPITAL: 'hospital',
  PHARMACY: 'pharmacy',
  POLICE: 'police',
  KIOSK: 'kiosk',
  COMMUNITY: 'community',
};

export const JOURNEY_STATUS = {
  PLANNED: 'planned',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const DISTRESS_LEVELS = {
  NONE: 'none',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
];

export const DEFAULT_MAP_CENTER = [-74.0060, 40.7128]; // NYC
export const DEFAULT_MAP_ZOOM = 13;
export const DETECTION_INTERVAL = 1000; // ms
export const LOCATION_UPDATE_INTERVAL = 5000; // ms

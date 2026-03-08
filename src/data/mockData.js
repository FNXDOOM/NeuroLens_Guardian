// Mock data for development and testing

export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    phone: '+1234567890',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+0987654321',
      relationship: 'Daughter',
    },
    preferences: {
      voiceGuidance: true,
      volume: 75,
      language: 'en',
      highContrast: false,
      largeText: true,
    },
    medicalInfo: {
      conditions: ['Mild cognitive impairment'],
      medications: ['Medication A', 'Medication B'],
      allergies: [],
    },
  },
];

export const mockCaregivers = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'caregiver',
    phone: '+0987654321',
    assignedUsers: ['1'],
  },
];

export const mockAlerts = [
  {
    id: '1',
    userId: '1',
    type: 'obstacle',
    severity: 'high',
    message: 'Vehicle detected 8m ahead',
    timestamp: new Date(Date.now() - 2000),
    resolved: false,
  },
  {
    id: '2',
    userId: '1',
    type: 'route',
    severity: 'medium',
    message: 'User deviated from planned route',
    timestamp: new Date(Date.now() - 60000),
    resolved: false,
  },
  {
    id: '3',
    userId: '1',
    type: 'distress',
    severity: 'high',
    message: 'Elevated confusion detected',
    timestamp: new Date(Date.now() - 180000),
    resolved: false,
  },
];

export const mockJourneys = [
  {
    id: '1',
    userId: '1',
    startTime: new Date(Date.now() - 1800000),
    endTime: null,
    origin: { lat: 40.7128, lng: -74.0060, name: 'Home' },
    destination: { lat: 40.7580, lng: -73.9855, name: 'City Center' },
    status: 'active',
    progress: 65,
    events: [
      {
        id: '1',
        type: 'start',
        description: 'Journey started',
        timestamp: new Date(Date.now() - 1800000),
      },
      {
        id: '2',
        type: 'hazard',
        description: 'Vehicle detected',
        timestamp: new Date(Date.now() - 1200000),
      },
      {
        id: '3',
        type: 'safe_zone',
        description: 'Passed City Pharmacy',
        timestamp: new Date(Date.now() - 600000),
      },
    ],
  },
];

export const mockConversations = [
  {
    id: '1',
    sender: 'ai',
    message: 'Walk straight for 20 meters.',
    timestamp: new Date(Date.now() - 300000),
    type: 'guidance',
  },
  {
    id: '2',
    sender: 'user',
    message: 'Where am I?',
    timestamp: new Date(Date.now() - 240000),
    type: 'question',
  },
  {
    id: '3',
    sender: 'ai',
    message: 'You are on Main Street, heading towards City Center.',
    timestamp: new Date(Date.now() - 180000),
    type: 'response',
  },
  {
    id: '4',
    sender: 'ai',
    message: 'There is a Safe Zone nearby at City Pharmacy, 150 meters ahead.',
    timestamp: new Date(Date.now() - 120000),
    type: 'info',
  },
];

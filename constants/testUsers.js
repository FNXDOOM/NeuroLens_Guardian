/**
 * Test User IDs for Development
 * 
 * These UUIDs correspond to the seed data in database/seed-data-simple.sql
 * Use these IDs when testing database queries and real-time subscriptions.
 */

export const TEST_USERS = {
  // Regular Users
  JOHN: '11111111-1111-1111-1111-111111111111',
  MARIA: '22222222-2222-2222-2222-222222222222',
  
  // Caregivers
  JANE: '33333333-3333-3333-3333-333333333333',
  CARLOS: '44444444-4444-4444-4444-444444444444',
}

export const TEST_USER_PROFILES = {
  [TEST_USERS.JOHN]: {
    id: TEST_USERS.JOHN,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    conditions: ['Mild cognitive impairment', 'Hypertension'],
    guardian: TEST_USERS.JANE,
  },
  [TEST_USERS.MARIA]: {
    id: TEST_USERS.MARIA,
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    role: 'user',
    conditions: ['Autism Spectrum Disorder'],
    guardian: TEST_USERS.CARLOS,
  },
  [TEST_USERS.JANE]: {
    id: TEST_USERS.JANE,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'caregiver',
    assignedUsers: [TEST_USERS.JOHN],
  },
  [TEST_USERS.CARLOS]: {
    id: TEST_USERS.CARLOS,
    name: 'Carlos Garcia',
    email: 'carlos.garcia@example.com',
    role: 'caregiver',
    assignedUsers: [TEST_USERS.MARIA],
  },
}

export default TEST_USERS

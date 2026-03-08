// Supabase client configuration
// TODO: Add Supabase credentials to .env file

let supabaseClient = null;

export const initSupabase = () => {
  // Placeholder for Supabase initialization
  // Will be implemented when Supabase credentials are available
  console.log('Supabase client initialization placeholder');
  return null;
};

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = initSupabase();
  }
  return supabaseClient;
};

// Mock data services
export const authService = {
  signIn: async (email, password) => {
    // Mock sign in
    return { user: { id: '1', email, role: 'user' }, error: null };
  },
  signUp: async (email, password, userData) => {
    // Mock sign up
    return { user: { id: '1', email, ...userData }, error: null };
  },
  signOut: async () => {
    // Mock sign out
    return { error: null };
  },
  getCurrentUser: async () => {
    // Mock current user
    return { id: '1', email: 'user@example.com', role: 'user' };
  },
};

export const userService = {
  getProfile: async (userId) => {
    // Mock user profile
    return {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+0987654321',
    };
  },
  updateProfile: async (userId, data) => {
    // Mock update
    return { success: true, data };
  },
};

export const caregiverService = {
  getAssignedUsers: async (caregiverId) => {
    // Mock assigned users
    return [
      { id: '1', name: 'John Doe', status: 'active', lastSeen: new Date() },
      { id: '2', name: 'Jane Smith', status: 'inactive', lastSeen: new Date() },
    ];
  },
  getUserLocation: async (userId) => {
    // Mock location
    return { lat: 40.7128, lng: -74.0060, timestamp: new Date() };
  },
};

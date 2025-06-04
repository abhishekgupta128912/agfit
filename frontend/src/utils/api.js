import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agfit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('agfit_token');
      localStorage.removeItem('agfit_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// Profile API functions
export const profileAPI = {
  // Get user health profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Create or update health profile
  createOrUpdateProfile: async (profileData) => {
    const response = await api.post('/profile', profileData);
    return response.data;
  },

  // Update specific section of profile
  updateProfileSection: async (section, sectionData) => {
    const response = await api.patch(`/profile/${section}`, sectionData);
    return response.data;
  },

  // Get profile completion status
  getProfileStatus: async () => {
    const response = await api.get('/profile/status');
    return response.data;
  },

  // Delete profile
  deleteProfile: async () => {
    const response = await api.delete('/profile');
    return response.data;
  }
};

// AI API functions (for future use)
export const aiAPI = {
  // Get AI recommendations
  getRecommendations: async (profileData) => {
    const response = await api.post('/ai/recommendations', profileData);
    return response.data;
  }
};

// Progress API functions (for future use)
export const progressAPI = {
  // Get user progress
  getProgress: async (dateRange) => {
    const response = await api.get('/progress', { params: dateRange });
    return response.data;
  },

  // Update daily progress
  updateProgress: async (progressData) => {
    const response = await api.post('/progress', progressData);
    return response.data;
  }
};

export default api;

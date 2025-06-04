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
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password });
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

// AI API functions
export const aiAPI = {
  generateNutritionPlan: (data) => api.post('/ai/nutrition', data),
  generateWorkoutPlan: (data) => api.post('/ai/workout', data),
  generateWellnessPlan: (data) => api.post('/ai/wellness', data),
  generateComprehensivePlan: (data) => api.post('/ai/comprehensive', data),
  getRecommendations: (params) => api.get('/ai/recommendations', { params }),
  getRecommendation: (id) => api.get(`/ai/recommendations/${id}`),
  addFeedback: (id, feedback) => api.post(`/ai/recommendations/${id}/feedback`, feedback),
  followRecommendation: (id) => api.put(`/ai/recommendations/${id}/follow`),
  archiveRecommendation: (id) => api.delete(`/ai/recommendations/${id}`),
  getStats: () => api.get('/ai/stats')
};

// Progress API functions
export const progressAPI = {
  getTodayProgress: () => api.get('/progress/today'),
  updateTodayProgress: (data) => api.put('/progress/today', data),
  logMeal: (mealData) => api.post('/progress/meal', mealData),
  logWater: (waterData) => api.post('/progress/water', waterData),
  completeExercise: (exerciseData) => api.post('/progress/exercise', exerciseData),
  getProgressHistory: (params) => api.get('/progress/history', { params }),
  getUserStats: () => api.get('/progress/stats')
};

export default api;
